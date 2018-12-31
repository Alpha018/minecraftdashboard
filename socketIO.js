/**
 * Created by Tomás on 20-12-2018.
 */
'use strict';

const proc = require('child_process');
const osm = require("os-monitor");
const log4js = require('log4js');
const utils = require('./server/utils/utils');
const PropertiesReader = require('properties-reader');
const fs = require('fs');
const logger = log4js.getLogger('Minecraft Dashboard');

let server = null;
let mc_server = null;
let globalConsole = [];
let clients = [];

function startScocket(app) {
    const io = require('socket.io')(app);

    logger.info('Start SockerIO');

    // socket io auth
    io.set('authorization', function (handshake, callback) {
        utils.validateUser(handshake._query.Authorization).then((userData) => {
            if (userData.status) {
                callback(null, true);
            } else {
                callback(userData.desc, false);
            }
        }).catch((error) => {
            callback(error.message, false);
        });
    });

    io.on('connection', function (socket) {

        clients[socket.id] = socket;

        osm.start({
            delay: 3000,
            stream: false,
            immediate: false
        }).pipe(process.stdout);

        // --------------------------STATUS SERVER------------------------------
        socket.on('get_status', function (data) {
            socket.emit('status', server);
        });

        // --------------------------DISCONNECT----------------------------------
        socket.on('disconnect', function (data) {
            delete clients[socket.id];
            osm.stop();
            socket.disconnect();
        });

        // --------------------------INIT SERVER---------------------------------
        socket.on('start_server', function (name) {

            // if the server exist or not
            logger.info('Starting MineCraft Server');

            if (mc_server) {
                socket.emit('fail', 'start_server');
                logger.info('Server already started');
                return;
            }
            // set the server name
            server = name.name;

            // init the minecraft server
            startServerMinecraft(io);

            socket.emit('status', server);


        });

        // --------------------------RESTART SERVER----------------------------------
        socket.on('restart_server', function (name) {
            try {
                mc_server.kill('SIGINT');
            } catch (e) {
                logger.warn('Minecraft server not started for restart');
            }
            server = mc_server = null;
            socket.emit('status', null);

            // wait to kill procces
            setTimeout(function () {
                // if the server exist or not
                logger.info('Starting MineCraft Server');

                if (mc_server) {
                    socket.emit('fail', 'server_started');
                    logger.info('Server already started');
                    return;
                }

                // set server name
                server = name.name;

                // init the minecraft server
                startServerMinecraft(io);

                socket.emit('status', server);

            }, 2000);
        });
        // --------------------------ACCEPT EULA--------------------------------

        socket.on('get_eula', function () {
            try {
                const properties = PropertiesReader(`${process.env.MINECRAFT_DIRECTORY}/eula.txt`);
                socket.emit('server_eula', properties);
            } catch (e) {
                socket.emit('fail', 'error_reading_server_eula');
            }
        });

        socket.on('accept_eula', function () {
            if (server) {
                socket.emit('fail', 'server_is_started');
                return;
            }

            try {
                const properties = PropertiesReader(`${process.env.MINECRAFT_DIRECTORY}/eula.txt`);
                if (properties._propertiesExpanded.eula === 'true') {
                    socket.emit('fail', 'eula_true');
                    return;
                }
                properties.set('eula', 'true');
                let saved = [];
                properties.each((key, val) => saved.push(`${key} = ${val}`));

                fs.writeFile(
                    `${process.env.MINECRAFT_DIRECTORY}/eula.txt`, saved.join('\n'), (err) => {
                        if (err) socket.emit('fail', 'fail_to_edit_eula');
                        socket.emit('change_server_eula', true);
                    });
            } catch (e) {
                socket.emit('fail', 'fail_to_find_eula');
            }
        });

        // --------------------------EDIT SERVER PROPERTIES---------------------
        socket.on('get_server_properties', function () {
            if (server) {
                socket.emit('fail', 'server_is_started');
                return;
            }
            try{
                const properties = PropertiesReader(`${process.env.MINECRAFT_DIRECTORY}/server.properties`);
                socket.emit('server_properties', properties);
            } catch (e) {
                socket.emit('fail', 'error_reading_server_prop');
            }
        });

        socket.on('change_server_properties', function (object) {
            if (server) {
                socket.emit('fail', 'server_is_started');
                return;
            }
            const prop = object.prop;
            const value = object.value;

            if (prop && value) {
                try{
                    const properties = PropertiesReader(`${process.env.MINECRAFT_DIRECTORY}/server.properties`);
                    properties.set(prop, value);

                    let saved = [];
                    properties.each((key, val) => saved.push(`${key} = ${val}`));

                    fs.writeFile(
                        `${process.env.MINECRAFT_DIRECTORY}/server.properties`, saved.join('\n'), (err) => {
                            if (err) socket.emit('fail', 'error_writing_server_prop');
                            socket.emit('change_server_properties_response', true);
                        });
                } catch (e) {
                    socket.emit('fail', 'error_writing_server_prop');
                }
            } else {
                socket.emit('fail', 'error_writing_server_prop');
            }
        });
        // --------------------------CLOSE SERVER------------------------------
        socket.on('close_server', function () {
            try {
                mc_server.kill('SIGINT');
            } catch (e) {
                logger.warn('Minecraft server not started for restart');
            }
            server = mc_server = null;
            socket.emit('status', null);
        });

        // --------------------------COMMAND INSERT----------------------------------
        socket.on('command', function (cmd) {
            if (mc_server) {
                mc_server.stdin.write(cmd.command + "\r");
            } else {
                socket.emit('fail', cmd.command);
            }
        });

        // --------------------------GLOBAL CONSOLE----------------------------------
        socket.on('get_global_console', function () {
            socket.emit('global_console', {
                console: globalConsole
            });
        });


        // --------------------------SYSTEM TYPE----------------------------------
        socket.on('get_system_type', function () {
            socket.emit('system_type', {
                type: osm.os.type(),
                cpus: osm.os.cpus()
            });
        });

        osm.on('monitor', function (monitorEvent) {
            socket.emit('system_usage', monitorEvent)
        });

        process.stdin.resume();
        process.stdin.on('data', function (data) {
            if (mc_server) {
                mc_server.stdin.write(data);
            }
        });

    });

    io.on('error', function (err) {
    });
}

function startServerMinecraft(io) {
    mc_server = proc.spawn(
        "java",
        ['-Xms1024M', '-Xmx1024M', '-jar', process.env.MINECRAFT_SERVER, 'nogui'],
        {cwd: process.env.MINECRAFT_DIRECTORY}
    );

    streamConsole(io);
}

function streamConsole(io) {

    mc_server.stdout.on('data', function (data) {
        if (data) {
            const dato = ("" + data).split(/(\[\d+:\d+:\d+()*)/);
            if (dato.length > 4) {
                try {
                    const final = dato[1] + dato[3];
                    const final2 = dato[4] + dato[6];
                    io.sockets.emit('console', "" + final);
                    io.sockets.emit('console', "" + final2);
                    globalConsole.push("" + dato[1] + dato[3]);
                    globalConsole.push("" + dato[4] + dato[6]);
                    try {
                        const final3 = dato[7] + dato[9];
                        if (final3) {
                            io.socket.emit('console', "" + final3);
                            globalConsole.push("" + final3);
                        }
                    } catch (e) {

                    }
                } catch (e) {
                    io.sockets.emit('console', "" + data);
                }
            } else {
                io.sockets.emit('console', "" + data);
                if (globalConsole.length > 200) {
                    globalConsole.shift();
                }
                globalConsole.push("" + data);
            }
        }
    });

    mc_server.on('exit', function () {
        mc_server = server = null;
        try {
            io.socket.emit('status', null);
        } catch (e) {

        }
    });

}

module.exports = {
    startScocket
};