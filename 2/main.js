/*1 задание:
 Написать для Node.JS функцию, которая рекурсивно выводит список всех файлов и папок и их размер:
 например:
 dir1 (1000kb)
 — subDir1 (500kb)
 ——— subFile1 (300kb)
 ——— subFile2 (200kb)
 — subDir2 (500)
 ——— subFile1 (500kb)

 2 задание:
 Написать свой веб сервер, который отдает в браузер инфо из ДЗ1 в зависимости от запрошенного url
 */

const PORT=8080;

var http = require('http');

http.createServer(function (req, res) {
    var html = buildHtml(req);

    res.writeHead(200, {
        'Content-Type': 'text/html',
    });
    res.end(html);
}).listen(PORT);

function buildHtml(request) {
    var header = '<meta charset="utf-8">';
    var styles = getStyles();
    var body = '';
    let Directory = require('./directory.js');

    let responseText = "";
    try {
        let dir = new Directory(request.url);
        let path = require('path');
        responseText = `<a href="${path.dirname(request.url)}"><div class="level-up">Вернуться обратно</div></a>` + dir.toHtml();
    } catch(err) {
        responseText = `<div class="error-message">Ошибка: ${err.message}</div>`;
    }
    this.path = require('path');

    body =  responseText;

    return '<!DOCTYPE html>'
        + '<html><header>' + header + styles + '</header><body>' + body + '</body></html>';
};

function getStyles() {
    let fs = require('fs');
    let styles = fs.readFileSync('styles.css', 'utf-8');
    return "<style>" + styles + "</style>";
}
