/**
 * Created by Tomás on 20-12-2018.
 */
'use strict';

const proc = require('child_process');
const osm = require("os-monitor");
const log4js = require('log4js');
const logger = log4js.getLogger('Minecraft Dashboard');

let server = null;
let mc_server = null;
let globalConsole = [];

function startScocket(app) {
    const io = require('socket.io')(app);

    logger.info('Start SockerIO');

    io.on('connection', function (socket) {

        osm.start({
            delay: 3000,
            stream: false,
            immediate: false
        }).pipe(process.stdout);

        logger.info('SocketIO Connect');

        // --------------------------STATUS SERVER------------------------------
        socket.on('get_status', function (data) {
            socket.emit('status', server);
        });

        // --------------------------DISCONNECT----------------------------------
        socket.on('disconnect', function (data) {
            osm.stop();
            socket.disconnect();
            logger.info('SocketIO disconnect');
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
                    socket.emit('fail', 'start_server');
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

        console.log(err);

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