import * as path from 'path';
import * as fs from 'fs';
import { Lib } from '../lib';

export interface GenerateParam {
    name: string;
    path: string;
    moduleFile: string;
    rootPath: string;
    [key: string]: any;
}

export interface ContentBase {
    generate: (params: GenerateParam) => string;
}

/**
 * 名称转换：sip-user_list.component ===> SipUserListComponent
 * @param name 
 */
export function MakeName(name: string) {
    return name.replace(/\b(\w)|\s(\w)/g, function (m) { return m.toUpperCase(); }).replace(/[-_.]/g, '');
}

/**
 * 生成文件名称
 * @param name 
 * @param prefix 
 * @param ext 
 */
export function MakeFileName(name: string, prefix: string, ext: string): string {
    let fileName = prefix ? [name, prefix, ext].join('.') : [name, ext].join('.');
    return fileName;
}

/**
 * 生成类名称
 * @param name 
 * @param prefix 
 */
export function MakeClassName(name: string, prefix: string) {
    let className = prefix ? [name, prefix].join('.') : name;
    return MakeName(className);
}

/**
 * 是否文件夹
 * @param fsPath 可以文件或目录
 */
export function IsDirectory(fsPath: string): boolean {
    let stats = fs.lstatSync(fsPath),
        isDir = stats.isDirectory();

    return isDir;
}

/**
 * 是否空文件夹
 * @param fsPath 可以文件或目录
 */
export function IsEmptyDirectory(fsPath: string): boolean {
    if (!IsDirectory(fsPath)) return false;
    return fs.readdirSync(fsPath).length <= 0;
}
/**
 * 如果是文件，返回文件所在目录；如果是目录直接返回
 * @param fsPath 可以文件或目录
 */
export function CalcPath(fsPath: string): string {
    let isDir = IsDirectory(fsPath);

    return isDir ? fsPath : path.dirname(fsPath);
}

const _rootRegex = /^\.\./;
/**
 * fsPath是否在rootPath里
 * @param rootPath 
 * @param fsPath 
 */
export function IsInRootPath(rootPath: string, fsPath: string): boolean {
    return !_rootRegex.test(path.relative(rootPath, fsPath));
}

/**
 * 从当前路径向上找到指定文件所在目录
 * FindPathUpward(rootPath, curPath, 'package.json')
 * @param rootPath 
 * @param curPath 可以文件或目录路径
 * @param fileName 文件名称
 */
export function FindPathUpward(rootPath: string, curPath: string, fileName: string): string {
    return FindPathUpwardIn(rootPath, CalcPath(curPath), fileName);
}

/**
 * 从当前路径向上找到指定文件所在路径（文件路径）
 * FindPathUpward(rootPath, curPath, 'package.json')
 * @param rootPath 
 * @param curPath 可以文件或目录路径
 * @param fileName 文件名称
 */
export function FindFileUpward(rootPath: string, curPath: string, fileName: string): string {
    let fsPath = FindPathUpwardIn(rootPath, CalcPath(curPath), fileName);
    return fsPath ? path.join(fsPath, fileName) : '';
}

function FindPathUpwardIn(rootPath: string, curPath: string, fileName: string): string {
    let fsPath = path.join(curPath, fileName);
    let exists = fs.existsSync(fsPath);
    if (exists)
        return curPath;
    else {
        if (!IsInRootPath(rootPath, curPath)) return '';
        curPath = FindPathUpwardIn(rootPath, path.dirname(curPath), fileName);
        return curPath;
    }
}

export function FindModuleFile(rootPath: string, curPath: string): string {
    let baseName = path.basename(curPath);
    let fsPath = path.join(curPath, [baseName, 'module.ts'].join('.'));
    if (fs.existsSync(fsPath))
        return fsPath;
    else {
        curPath = path.dirname(curPath);
        if (IsInRootPath(rootPath, curPath))
            return FindModuleFile(rootPath, curPath);
        else
            return '';
    }
};

export function _FindUpwardModuleFiles(files: string[], rootPath: string, curPath: string, curFile: string, lv: number) {
    if (!IsInRootPath(rootPath, curFile)) return;

    let mdRegex = /module\.ts\s*$/i;
    let file, hasFile = false;
    fs.readdirSync(curPath).forEach(fileName => {
        if (mdRegex.test(fileName)) {
            file = path.join(curPath, fileName);
            if (file != curFile)
                files.push(file);
        }
    });
    if (lv < 2) {
        _FindUpwardModuleFiles(files, rootPath, path.dirname(curPath), curFile, lv + 1);
    }
};

export function FindUpwardModuleFiles(rootPath: string, curFile: string): string[] {
    let files = [];
    _FindUpwardModuleFiles(files, rootPath, CalcPath(curFile), curFile, 0);
    return files;
};


export function CalcImportPath(moduleFile: string, tsFile: string) {
    let mdPath = path.dirname(moduleFile);
    let tsPath = path.dirname(tsFile);
    let fileName = path.parse(tsFile).name;
    let importPath = ['.', path.relative(mdPath, tsPath), fileName].join('/');
    return importPath.replace(/\/{2,}/g, '/').replace(/(?:\.\/){2,}/g, './').replace(/\/+/g, '/');
}

let _importRegex = /\/\/\-\-\s*register\s+import/i;
let _importEndRegex = /\/\/\-\-\s*end\s+import/i;
export function PushToImport(content: string, className: string, importPath: string, isExport: boolean): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n').reverse();
    let hasImport = _importRegex.test(content);
    let importRegex = /^\s*import\s+/;
    let index = contentList.findIndex(item => { return hasImport ? _importEndRegex.test(item) : importRegex.test(item); });
    if (index < 0) {
        index = contentList.length - 1;
    }

    if (hasImport)
        contentList[index] = ["import { ", className, " } from '", importPath, "';\n"].join('') + contentList[index];
    else
        contentList[index] = contentList[index] + ["\n\n//-- register import\nimport { ", className, " } from '", importPath, "';"].join('') + '\n//-- end import';

    if (isExport)
        _pushToExport(contentList, index, importPath, _exportRegex.test(content));
    return contentList.reverse().join('\n');

}

export function RemoveFromImport(content: string, className: string, importPath: string): string {

    if (!_importRegex.test(content) && !_exportRegex.test(content))
        return content;

    let contentList = content.replace(/\n\r/g, '\n').split('\n');
    let importRegex = new RegExp('^\\s*\\bimport\\b.*\\b' + className + '\\b');
    let exportRegex = new RegExp('^\\s*\\bexport\\b.*\\bfrom\\b');
    let exportPath = '\'' + importPath + '\'';
    let index = contentList.findIndex(item => {
        return importRegex.test(item)
            || (exportRegex.test(item) && item.indexOf(exportPath) > 0)
    });
    if (index > -1) {
        contentList.splice(index, 1);
        return RemoveFromImport(contentList.join('\n'), className, importPath);
    }

    return contentList.join('\n');

}

let _exportRegex = /\/\/\-\-\s*register\s+export/i;
let _exportEndRegex = /\/\/\-\-\s*end\s+export/i;
export function PushToExport(content: string, className: string, importPath: string, isExport: boolean): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n').reverse();
    let hasImport = _importRegex.test(content);
    let importRegex = /^\s*import\s+/;
    let index = contentList.findIndex(item => { return hasImport ? _importEndRegex.test(item) : importRegex.test(item); });

    _pushToExport(contentList, index, importPath, _exportRegex.test(content));
    return contentList.reverse().join('\n');

}
function _pushToExport(contentList: string[], importIndex: number, importPath: string, hasExport: boolean): string[] {

    let exportRegex = /^\s*export\s+\*/;
    let index = contentList.findIndex(item => { return hasExport ? _exportEndRegex.test(item) : exportRegex.test(item); });
    if (index < 0) {
        index = importIndex;
    }

    if (hasExport)
        contentList[index] = ["export * from '", importPath, "';\n"].join('') + contentList[index];
    else
        contentList[index] = contentList[index] + ["\n\n//-- register export\nexport * from '", importPath, "';"].join('') + '\n//-- end export';

    return contentList
}

function _pushClassName(text: string, className: string): string {
    let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
    classText = classText.replace(/,/g, ',\n        ');
    classText = ['\n        ', classText, '\n    '].join('');
    return classText;
}

function _removeClassName(text: string, className: string): string {
    let classText = text.replace(/[\r\n\s]+/g, '')
        .split(',').filter(item => item != className).join(',');

    classText = classText.replace(/,/g, ',\n        ');
    classText = ['\n        ', classText, '\n    '].join('');
    return classText;
}

interface IContentInfo {
    start:number;
    content:string;
}

//#region getContent

function _escape(text:string):string{
    return encodeURIComponent(text).replace('\'', '%27');
}

function _unescape(text:string):string{
    return decodeURIComponent(text);
}

function _encodeNotes(content:string){
    return content.replace(/\/\*\*((?:\n|\r|.)*?)\*\//gm, function(find, text){
            return ['|>>', _escape(text), '>|'].join('');
        }).replace(/\/\/(.*)$/gm, function(find, text){
            return ['|--', _escape(text)].join('');
        });
}

function _decodeNotes(content:string){
    return content.replace(/\|\>\>((?:\n|\r|.)*?)\>\|/gm, function(find, text){
            return ['/**', _unescape(text), '*/'].join('');
        }).replace(/\|\-\-(.*)$/gm, function(find, text){
            return ['//', _unescape(text)].join('');
        });
}

function _getStrContent(content:string, split:string, start:number):IContentInfo{
    let len = content.length;
    let prec, c, list = [];
    for (let i=start;i<len;i++){
        c = content.charAt(i);
        if (prec != '\\' && c == split){
            break;
        }
        list.push(c);
        prec = prec == '\\' ? '' : c;
    }
    return {
        start:start,
        content:list.join('')
    };
}

function _getRegexContent(content:string, start:number):IContentInfo{
    let len = content.length;
    let prec, c, list = [];
    for (let i=start;i<len;i++){
        c = content.charAt(i);
        if (prec != '\\' && c == '/'){
            break;
        }
        list.push(c);
        prec = prec == '\\' ? '' : c;
    }
    return {
        start:start,
        content:list.join('')
    };
}

let _strSplitRegex = /['"`]/;
function _getContent(content:string, start:number, splitStart:string, splitEnd:string):IContentInfo{

    let len = content.length;
    let prec, c, list = [];
    let info:IContentInfo, lv = 0;
    for (let i=start;i<len;i++){
        c = content.charAt(i);
        if (prec != '\\'){
            if (c == '/'){
                info = _getRegexContent(content, i+1);
                list.push(['/'+info.content, '/'].join(''));
                i = info.start + info.content.length;
            } else if (_strSplitRegex.test(c)) {
                info = _getStrContent(content, c, i+1);
                list.push([c+info.content, c].join(''));
                i = info.start + info.content.length;
            } else if (c == splitStart) {
                lv++;
                list.push(c);
            } else if (c == splitEnd){
                if (lv == 0)
                    break;
                else {
                    lv--;
                    list.push(c);
                }
            } else
                list.push(c);
        } else
            list.push(c);
        prec = prec == '\\' ? '' : c;
    }

    return {
        start:start,
        content: list.join('')
    };
}

function _getModuleDeclarContent(content: string, propName: string): IContentInfo {
    
    let typeRegex = new RegExp('\\b'+propName+'\\b\\s*\\:\\s*\\[');
    content = _encodeNotes(content);
    let regText = typeRegex.exec(content);
    if (regText){

        let start = regText.index + regText[0].length;
        let info = _getContent(content, start, '[', ']');
        info.content = _decodeNotes(info.content);
        return info;
    }

    return {
        start: -1,
        content: ''
    };

};

//#endregion getContent

export function PushToModuleDeclarations(content: string, className: string) {
    console.log(content);
    console.log('============================>');
    return _getModuleDeclarContent(content, 'declarations').content;
    content = content.replace(/declarations\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _pushClassName(text, className);
            return find.replace(text, classText);
        } else
            return 'declarations: [ ' + className + ' ]'
    });

    return content;
}

function _newWordRegex(work: string) {
    return new RegExp('\\b' + work + '\\b');
}

export function RemoveFromModuleDeclarations(content: string, className: string) {

    content = content.replace(/declarations\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        if (!_newWordRegex(className).test(text)) return find;
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _removeClassName(text, className);
            return find.replace(text, classText);
        } else
            return find;
    });

    return content;
}

export function PushToModuleEntryComponents(content: string, className: string) {

    content = content.replace(/entryComponents\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _pushClassName(text, className);
            return find.replace(text, classText);
        } else
            return 'entryComponents: [ ' + className + ' ]'
    });

    return content;
}

export function RemoveModuleEntryComponents(content: string, className: string) {

    content = content.replace(/entryComponents\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        if (!_newWordRegex(className).test(text)) return find;
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _removeClassName(text, className);
            return find.replace(text, classText);
        } else
            return find;
    });

    return content;
}

export function PushToModuleImports(content: string, className: string) {

    content = content.replace(/imports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _pushClassName(text, className);
            return find.replace(text, classText);
        } else
            return 'imports: [ ' + className + ' ]'
    });

    return content;
}

export function RemoveFromModuleImports(content: string, className: string) {

    content = content.replace(/imports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        if (!_newWordRegex(className).test(text)) return find;
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _removeClassName(text, className);
            return find.replace(text, classText);
        } else
            return find;
    });

    return content;
}

export function PushToModuleExports(content: string, className: string) {

    content = content.replace(/exports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _pushClassName(text, className);
            return find.replace(text, classText);
        } else
            return 'exports: [ ' + className + ' ]'
    });

    return content;
}

export function RemoveFromModuleExports(content: string, className: string) {

    content = content.replace(/exports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        if (!_newWordRegex(className).test(text)) return find;
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _removeClassName(text, className);
            return find.replace(text, classText);
        } else
            return find;
    });

    return content;
}

export function PushToModuleProviders(content: string, className: string) {

    content = content.replace(/providers\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _pushClassName(text, className);
            return find.replace(text, classText);
        } else
            return 'providers: [ ' + className + ' ]'
    });

    return content;
}

export function RemoveFromModuleProviders(content: string, className: string) {

    content = content.replace(/providers\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        if (!_newWordRegex(className).test(text)) return find;
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = _removeClassName(text, className);
            return find.replace(text, classText);
        } else
            return find;
    });

    return content;
}

let _routingRegex = /const\s+routes\s*:\s*Routes\s*\=\s*\[((?:\n|\r|.)*)\]\s*\;/m;
function _isRoutingModule(content: string): boolean {
    return _routingRegex.test(content);
}
function _getRoutingContent(content: string): string {
    let finds = /\s*\/\/\-\-\s*register(?:\n|\r|.)*\/\/\-\-\s*end\s+register/m.exec(content);
    return finds ? finds[0] : '';
}
export function IsRoutingModule(content: string): boolean {
    return _isRoutingModule(content);
}
function _getRoutingItems(content: string): string[] {
    let contentList = content.replace(/[\r\n]+/g, '\n').split('\n');
    let retList: string[] = [],
        temp = '';
    contentList.forEach(item => {
        if (/^\s*\/\/\-\-\s*register/.test(item))
            temp = '';
        else if (/^\s*\/\/\-\-\s*end\s+register/.test(item))
            retList.push(temp);
        else
            temp = [temp, item].join('\n');
    });
    return retList;
}
function _makeRoutingItems(contentList: string[], notEnd: boolean): string {
    let len = contentList.length;
    if (notEnd)
        contentList[len - 1] += ',';
    else if (len > 1) {
        contentList[len - 2] += ',';
    }

    let content: string = contentList.map(item => {
        return ['    //-- register', item, '    //-- end register\n'].join('\n');
    }).join('\n').replace(/\n{2,}/g, '\n');
    if (!notEnd) {
        content = content.replace(/}\s*\,[^\{\}]+$/, '}\n    //-- end register');
    }

    return content;
}

export function PushToModuleRouting(content: string, name: string, className: string, importPath: string, isChild?: boolean) {

    content = content.replace(_routingRegex, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        let routingContent = _getRoutingContent(text);
        let routingItems = _getRoutingItems(routingContent);
        if (isChild) {
            routingItems.push(`    {
        path: '${name.replace(/-routing$/i, '')}',
        loadChildren: '${importPath}#${className}'
    }`);
        } else {
            routingItems.push(`    {
        path: '${name}',
        component: ${className}
    }`);
        }
        let notEnd = text.replace(routingContent, '').indexOf('{') >= 0;
        let retContent = text.replace(routingContent, '\n' + _makeRoutingItems(routingItems, notEnd));
        retContent = retContent.replace(/\,{2,}/g, ',');

        let retFind = isEmpty ? 'const routes: Routes = [' + retContent + '\n];'
            : find.replace(text, retContent);
        return retFind.replace(/\n{2,}/g, '\n')

    });

    return content;
}

export function RemoveFromModuleRouting(content: string, name: string, className: string, importPath: string, isChild?: boolean) {

    let compRegex = new RegExp('\\b' + className + '\\b');
    let filterChild = `'${importPath}#${className}'`;
    content = content.replace(_routingRegex, function (find, text, index) {
        if (!/\/\/\-\-\s*register/i.test(find)) return find;
        let isEmpty = !Lib.trim(text);
        let routingContent = _getRoutingContent(text);
        let routingItems = _getRoutingItems(routingContent);
        routingItems = routingItems.filter((item) => {
            return isChild ? item.indexOf(filterChild) < 0
                : !compRegex.test(item);
        })

        let notEnd = text.replace(routingContent, '').indexOf('{') >= 0;
        let retContent = text.replace(routingContent, '\n' + _makeRoutingItems(routingItems, notEnd));
        retContent = retContent.replace(/\,{2,}/g, ',');

        let retFind = isEmpty ? 'const routes: Routes = [' + retContent + '\n];'
            : find.replace(text, retContent);
        return retFind.replace(/\n{2,}/g, '\n');

    });

    return content;
}

export function IsInModuel(content: string, className: string): boolean {
    return new RegExp('\\b' + className + '\\b').test(content);
}