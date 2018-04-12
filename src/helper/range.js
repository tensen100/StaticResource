module.exports = (totalsize, req, res) => {
    const range = req.headers['range'];
    if (!range) {
        return {code: 200}
    }
    const sizes = range .match(/bytes=(\d*)-(\d*)/);
    const end = sizes[2] || totalsize - 1;
    const start = sizes[1] || totalsize - end;

    if(start > end || sizes < 0 || end > totalsize) {
        return {code: 200}
    }
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range', `bytes ${start}-${end}/${totalsize}`);
    res.setHeader('Content-Length', end - start);
    return {
        code: 206,
        start: parseInt(start),
        end: parseInt(end)
    }
};