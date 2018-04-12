const http = require('http');
const chalk = require('chalk');
const path = require('path');
const config = require('./src/config/defaultConfig');
const route = require('./src/helper/route');
const open = require('./src/helper/open');

const server = http.createServer((req, res) => {
            const filePath = path.join(config.root, req.url);
            route(req, res, filePath, config);
        });

server.listen(config.port, config.hostname, () => {
    const addr = `http://${config.hostname}:${config.port}`;
    console.info(`Server started at ${chalk.green(addr)}`);
    open(addr)
});


// class Server {
//     constructor(conf) {
//         this.config = Object.assign({}, config, conf)
//     }
//     start() {
//         const server = http.createServer((req, res) => {
//             const filePath = path.join(this.config.root, req.url);
//             route(req, res, filePath, this.config);
//         });
//         server.listen(this.config.port, this.config.hostname, () => {
//             const addr = `http://${this.config.hostname}:${this.config.port}`;
//             console.info(`Server started at ${chalk.green(addr)}`);
//             open(addr)
//         });
//     }
// }
// module.exports = Server

