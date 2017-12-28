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
    return importPath.replace(/\/{2,}/g, '/').replace(/(?:\.\/){2,}/g, './').replace(/[\/\\]+/g, '/');
}

let _importRegex = /^\s*\bimport\b.+?from/i;
export function PushToImport(content: string, className: string, importPath: string, isExport: boolean): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n').reverse();
    let hasImport = _importRegex.test(content);
    let importRegex = /^\s*import\s+/;
    let index = contentList.findIndex(item => { return _importRegex.test(item); });
    let has = true;
    if (index < 0) {
        index = contentList.length - 1;
        has = false;
    }

    let str = ["import { ", className, " } from '", importPath, "';"].join('');
    if (has)
        contentList[index] += ('\n' + str);
    else
        contentList[index] = str + '\n' + contentList[index];

    if (isExport)
        _pushToExport(contentList, importPath);
    return contentList.reverse().join('\n');

}

export function RemoveFromImport(content: string, className: string, importPath: string): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n');
    let importRegex = new RegExp('^\\s*\\bimport\\b.*\\b' + className + '\\b');
    let exportRegex = new RegExp('^\\s*\\bexport\\b.*\\bfrom\\b');
    let exportPath = '\'' + importPath + '\'';
    let index = contentList.findIndex(item => {
        return importRegex.test(item)
            || (exportRegex.test(item) && item.indexOf(exportPath) > 0)
    });
    let retContent = content;
    if (index > -1) {
        contentList.splice(index, 1);
        retContent = RemoveFromImport(contentList.join('\n'), className, importPath);
    }

    return retContent;
}


let _exportRegex = /^\s*\bexport\b.+?from/i;
export function PushToExport(content: string, className: string, importPath: string, isExport: boolean): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n').reverse();
    _pushToExport(contentList, importPath);
    return contentList.reverse().join('\n');

}
function _pushToExport(contentList: string[], importPath: string): string[] {

    let index = contentList.findIndex(item => { return _exportRegex.test(item); });
    let has = true;
    if (index < 0) {
        index = contentList.findIndex(item => { return _importRegex.test(item); });
        has = false;
    }
    if (index < 0) {
        index = contentList.length - 1;
    }

    let str = ["export * from '", importPath, "';"].join('');
    if (has)
        contentList[index] += ('\n' + str);
    else
        contentList[index] += ('\n\n' + str);

    return contentList
}

function _pushClassName(text: string, className: string): string {
    let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
    classText = classText.replace(/,/g, ',\n        ');
    classText = ['\n        ', classText, '\n    '].join('');
    return classText;
}

interface IContentInfo {
    start: number;
    content: string;
}

//#region getContent

function _escape(text: string): string {
    return encodeURIComponent(text).replace('\'', '%27');
}

function _unescape(text: string): string {
    return decodeURIComponent(text);
}

function _encodeNotes(content: string) {
    return content.replace(/\/\*\*((?:\n|\r|.)*?)\*\//gm, function (find, text) {
        return ['|>>', _escape(text), '>|'].join('');
    }).replace(/\/\/(.*)$/gm, function (find, text) {
        return ['|--', _escape(text)].join('');
    });
}

function _decodeNotes(content: string) {
    return content.replace(/\|\>\>((?:\n|\r|.)*?)\>\|/gm, function (find, text) {
        return ['/**', _unescape(text), '*/'].join('');
    }).replace(/\|\-\-(.*)$/gm, function (find, text) {
        return ['//', _unescape(text)].join('');
    });
}

function _getStrContent(content: string, split: string, start: number): IContentInfo {
    start++;
    let len = content.length;
    let prec, c, list = [];
    for (let i = start; i < len; i++) {
        c = content.charAt(i);
        if (prec != '\\' && c == split) {
            break;
        }
        list.push(c);
        prec = prec == '\\' ? '' : c;
    }
    return {
        start: start,
        content: list.join('')
    };
}

function _getRegexContent(content: string, start: number): IContentInfo {
    start++;
    let len = content.length;
    let prec, c, list = [];
    for (let i = start; i < len; i++) {
        c = content.charAt(i);
        if (prec != '\\' && c == '/') {
            break;
        }
        list.push(c);
        prec = prec == '\\' ? '' : c;
    }
    return {
        start: start,
        content: list.join('')
    };
}

let _strSplitRegex = /['"`]/;
function _getContentEx(content: string, start: number, splitStart: string, splitEnd: string): IContentInfo {
    start++;
    let len = content.length;
    let prec, c, list = [];
    let info: IContentInfo, lv = 0;
    for (let i = start; i < len; i++) {
        c = content.charAt(i);
        if (prec != '\\') {
            if (c == '/') {
                info = _getRegexContent(content, i);
                list.push(['/' + info.content, '/'].join(''));
                i = info.start + info.content.length;
            } else if (_strSplitRegex.test(c)) {
                info = _getStrContent(content, c, i);
                list.push([c + info.content, c].join(''));
                i = info.start + info.content.length;
            } else if (c == splitStart) {
                lv++;
                list.push(c);
            } else if (c == splitEnd) {
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
        start: start,
        content: list.join('')
    };
}

function _getContent(content: string, start: number, splitStart: string, splitEnd: string): IContentInfo {
    content = _encodeNotes(content.substr(start));
    let info = _getContentEx(content, 0, splitStart, splitEnd);
    return {
        start: start + 1,
        content: _decodeNotes(info.content)
    };
}

function _replaceContent(content: string, info: IContentInfo, newContent): string {
    let start = info.start;
    let end = start + info.content.length;
    return [content.substr(0, start), newContent, content.substr(end)].join('');
}

//#endregion getContent


function _getNgModuleContent(content: string): IContentInfo {

    let typeRegex = /\@NgModule\s*\(\s*\{/;
    let regText = typeRegex.exec(content);
    if (regText) {
        let start = regText.index + regText[0].length - 1;//index到'['的位置
        return _getContent(content, start, '{', '}');
    }

    return null;
};

function _getNgModulePropContent(content: string, propName: string): IContentInfo {

    let typeRegex = new RegExp('\\b' + propName + '\\b\\s*\\:\\s*\\[');
    let regText = typeRegex.exec(content);
    if (regText) {
        let start = regText.index + regText[0].length - 1;//index到'['的位置
        return _getContent(content, start, '[', ']');
    }

    return null;
};

function _pushNgModulePropClass(content: string, propName: string, className: string) {
    let ngModuleInfo = _getNgModuleContent(content);
    if (!ngModuleInfo) return content;

    let info = _getNgModulePropContent(ngModuleInfo.content, propName);
    let mdConten, descContent;
    if (info) {
        let isEmpty = !Lib.trim(info.content);
        descContent = isEmpty ? '\n        ' + className + '\n    '
            : Lib.trimEnd(info.content) + ',\n        ' + className + '\n    ';
        mdConten = _replaceContent(ngModuleInfo.content, info, descContent);

        content = _replaceContent(content, ngModuleInfo, mdConten);

    } else {
        descContent = propName + ': [\n        ' + className + '\n    ]'
        mdConten = Lib.trimEnd(ngModuleInfo.content) + ',\n    ' + descContent + '\n';
        content = _replaceContent(content, ngModuleInfo, mdConten);
    }

    return content;
}

function _newWordRegex(work: string) {
    return new RegExp('\\b' + work + '\\b');
}

function _hasClassName(content: string, className: string): boolean {
    return _newWordRegex(className).test(content);
}

function _removeNgModulePropClass(content: string, propName: string, className: string) {
    let ngModuleInfo = _getNgModuleContent(content);
    if (!ngModuleInfo) return content;

    let info = _getNgModulePropContent(ngModuleInfo.content, propName);
    if (info && _hasClassName(info.content, className)) {

        let removeRegex = new RegExp('\\,?(?:\\n|\\r|\\s)*\\b' + className + '\\b', 'g');
        let descContent = info.content.replace(removeRegex, '');
        let isEmpty = !Lib.trim(descContent);
        if (isEmpty) descContent = ' ';

        let mdConten = _replaceContent(ngModuleInfo.content, info, descContent);

        content = _replaceContent(content, ngModuleInfo, mdConten);

    }

    return content;
}

export function PushToModuleDeclarations(content: string, className: string) {
    return _pushNgModulePropClass(content, 'declarations', className);
}

export function RemoveFromModuleDeclarations(content: string, className: string) {
    return _removeNgModulePropClass(content, 'declarations', className);
}

export function PushToModuleEntryComponents(content: string, className: string) {
    return _pushNgModulePropClass(content, 'entryComponents', className);
}

export function RemoveModuleEntryComponents(content: string, className: string) {
    return _removeNgModulePropClass(content, 'entryComponents', className);
}

export function PushToModuleImports(content: string, className: string) {
    return _pushNgModulePropClass(content, 'imports', className);
}

export function RemoveFromModuleImports(content: string, className: string) {
    return _removeNgModulePropClass(content, 'imports', className);
}

export function PushToModuleExports(content: string, className: string) {
    return _pushNgModulePropClass(content, 'exports', className);
}

export function RemoveFromModuleExports(content: string, className: string) {
    return _removeNgModulePropClass(content, 'exports', className);
}

export function PushToModuleProviders(content: string, className: string) {
    return _pushNgModulePropClass(content, 'providers', className);
}

export function RemoveFromModuleProviders(content: string, className: string) {
    return _removeNgModulePropClass(content, 'providers', className);
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