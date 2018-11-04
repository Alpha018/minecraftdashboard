const io = require('socket.io').listen(8080);
const proc = require('child_process');
const osm = require("os-monitor");

let server = null;
let mc_server = null;
let globalConsole = [];

const log4js = require('log4js');
const logger = log4js.getLogger('Minecraft Dashboard');

function startScocket() {
    io.on('connection', function (socket) {

        // --------------------------STATUS SERVER------------------------------
        socket.on('get_status', function (data) {
            socket.emit('status', server);
        });

        // --------------------------DISCONNECT----------------------------------
        socket.on('disconnect', function (data) {
            console.log('desconectado!!')
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
            mc_server = proc.spawn(
                "java",
                ['-Xms1024M', '-Xmx1024M', '-jar', process.env.MINECRAFT_SERVER, 'nogui'],
                {cwd: process.env.MINECRAFT_DIRECTORY}
            );

            socket.emit('status', server);

            mc_server.stdout.on('data', function (data) {
                if (data) {
                    const dato = ("" + data).split(/(\[\d+:\d+:\d+()*)/);
                    if (dato.length > 4) {
                        try {
                            const final = dato[1] + dato[3];
                            const final2 = dato[4] + dato[6];
                            socket.emit('console', "" + final);
                            socket.emit('console', "" + final2);
                            globalConsole.push("" + dato[1] + dato[3]);
                            globalConsole.push("" + dato[4] + dato[6]);
                            try {
                                const final3 = dato[7] + dato[9];
                                if (final3) {
                                    socket.emit('console', "" + final3);
                                    globalConsole.push("" + final3);
                                }
                            } catch (e) {

                            }
                        } catch (e) {
                            socket.emit('console', "" + data);
                        }
                    } else {
                        socket.emit('console', "" + data);
                        if (globalConsole.length > 200) {
                            globalConsole.shift();
                        }
                        globalConsole.push("" + data);
                    }
                }
            });

            mc_server.on('exit', function () {
                mc_server = server = null;
                socket.emit('status', null);
            });


            // --------------------------RESTART SERVER----------------------------------
            socket.on('restart_server', function (name) {
                mc_server.kill('SIGINT');
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
                    mc_server = proc.spawn(
                        "java",
                        ['-Xms1024M', '-Xmx1024M', '-jar', process.env.MINECRAFT_SERVER, 'nogui'],
                        {cwd: process.env.MINECRAFT_DIRECTORY}
                    );

                    socket.emit('status', server);

                    mc_server.stdout.on('data', function (data) {
                        if (data) {
                            const dato = ("" + data).split(/(\[\d+:\d+:\d+()*)/);
                            if (dato.length > 4) {
                                try {
                                    const final = dato[1] + dato[3];
                                    const final2 = dato[4] + dato[6];
                                    socket.emit('console', "" + final);
                                    socket.emit('console', "" + final2);
                                    globalConsole.push("" + dato[1] + dato[3]);
                                    globalConsole.push("" + dato[4] + dato[6]);
                                    try {
                                        const final3 = dato[7] + dato[9];
                                        if (final3) {
                                            socket.emit('console', "" + final3);
                                            globalConsole.push("" + final3);
                                        }
                                    } catch (e) {

                                    }
                                } catch (e) {
                                    socket.emit('console', "" + data);
                                }
                            } else {
                                socket.emit('console', "" + data);
                                if (globalConsole.length > 200) {
                                    globalConsole.shift();
                                }
                                globalConsole.push("" + data);
                            }
                        }
                    });

                    mc_server.on('exit', function () {
                        mc_server = server = null;
                        socket.emit('status', null);
                    });
                }, 2000);
            });


            // --------------------------CLOSE SERVER------------------------------
            socket.on('close_server', function () {
                mc_server.kill('SIGINT');
                server = mc_server = null;
                socket.emit('status', null);
            });

            // --------------------------COMMAND INSERT----------------------------------
            socket.on('command', function (cmd) {
                if (mc_server) {
                    socket.emit('console', "Player Command: " + cmd.dato);
                    mc_server.stdin.write(cmd.dato + "\r");
                } else {
                    socket.emit('fail', cmd.dato);
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

            osm.start({
                delay: 3000,
                stream: false,
                immediate: false
            }).pipe(process.stdout);

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

    });
}

module.exports = {
    startSocket
};