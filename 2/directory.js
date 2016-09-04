class FsItem {

    constructor(itemPath, deepLevel) {
        if (new.target === FsItem) {
            throw new TypeError("Это абстрактный класс. Нельзя создать экземпляр.");
        }

        this.fs = require('fs');
        this.path = require('path');
        this.stats = this.fs.statSync(itemPath);
        this.itemPath = itemPath;

        if (deepLevel === undefined) {
            this.deepLevel = 0;
        } else {

            this.deepLevel = deepLevel + 1;
        }
    }
}

class File extends FsItem {
    constructor(itemPath, deepLevel) {
        super(...arguments);
        if (!this.stats.isFile()) {
            throw new TypeError("Это класс файла. В конструкторе передан не файл");
        }
    }

    get size() {
        return this.stats["size"];
    }

    toString() {
        return `${' '.repeat(this.deepLevel * 2)}-${this.path.basename(this.itemPath)} (${this.size} bytes)\n`;
    }

    toHtml() {
        return `<li class="file">${this.path.basename(this.itemPath)} <span class="file-size">(${this.size} bytes)</span></li>`;
    }
}

class Directory extends FsItem {
    constructor(itemPath, deepLevel) {
        super(...arguments);
        if (!this.stats.isDirectory()) {
            throw new TypeError("Это класс директории. В конструкторе передан файл");
        }

        this.children = [];
        let dir = this.fs.readdirSync(itemPath);
        dir.forEach((item)=> {
            let stats = this.fs.statSync(this.path.join(itemPath, item));
            let fullPath = this.path.join(itemPath, item);
            if (stats.isDirectory()) {
                let fsItem = new Directory(fullPath, this.deepLevel);
                this.children.push(fsItem);
            }
            if (stats.isFile()) {
                let fsItem = new File(fullPath, this.deepLevel);
                this.children.push(fsItem);
            }
        });
    }

    get size() {
        let result = 0;
        this.children.forEach(function (item) {
            result += item.size;
        });
        return result;
    }

    get childrenFiles() {
        return this.children.filter((item)=> {
            return (item instanceof File);
        });
    }

    get childrenDirs() {
        return this.children.filter((item)=> {
            return (item instanceof Directory);
        });
    }

    toString() {
        let result = `${' '.repeat(this.deepLevel * 2)}+${this.path.basename(this.itemPath)} (${this.size} bytes)\n`;

        this.childrenFiles.forEach((item)=> {
            result += item.toString();
        });

        this.childrenDirs.forEach((item)=> {
            result += item.toString();
        });

        return result;
    }

    toHtml() {
        let result = `<ul class="files-list"><a href="${this.itemPath}"><div class="dir-name">${this.path.basename(this.itemPath)} <span class="file-size">(${this.size} bytes)</span></div></a>`;

        this.childrenFiles.forEach((item)=> {
            result += item.toHtml();
        });

        this.childrenDirs.forEach((item)=> {
            result += item.toHtml();
        });
        result += "</ul>";
        return result;
    }
}

module.exports = Directory;


