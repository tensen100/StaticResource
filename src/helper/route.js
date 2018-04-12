const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const config = require('../config/defaultConfig');
const mime = require('../helper/mime');
const compress = require('../helper/compress');
const range = require('../helper/range');
const isFresh = require('../helper/cache');

const tplPath = path.join(__dirname, '../template/dir.html');
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());
module.exports = async function (req, res, filePath, config) {
    try {
        const stats =await stat(filePath);
        if (stats.isFile()) {
            const contentType = mime(filePath);
            res.setHeader('Content-Type',contentType);
            res.statusCode = 200;
            if(isFresh(stats, req, res)){
                res.statusCode = 304;
                res.end();
                return;
            }
            let rs;
            const {code, start, end} = range(stats.size, req, res);
            if ( code === 200) {
                rs = fs.createReadStream(filePath);
            } else {
                rs = fs.createReadStream(filePath, {start, end});
            }
            if (filePath.match(config.compress)) {
                rs = compress(rs ,req, res)
            }
            rs.pipe(res);
        }else if (stats.isDirectory()){
            const files = await readdir(filePath);
            const dir = path.relative(config.root, filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            };
            res.end(template(data))
        }
    } catch(ex) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${filePath} is not a directory or file \n ${ex.toString()}`);
    }
};