/*1 задание:
 Написать для Node.JS функцию, которая рекурсивно выводит список всех файлов и папок и их размер:
 например:
 dir1 (1000kb)
 — subDir1 (500kb)
 ——— subFile1 (300kb)
 ——— subFile2 (200kb)
 — subDir2 (500)
 ——— subFile1 (500kb)*/

let Directory = require('./directory.js');

let dir = new Directory('./');
console.log("Дерево файлов \n " + dir);