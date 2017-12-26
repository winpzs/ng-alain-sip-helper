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
 * 如果是文件，返回文件所在目录；如果是目录直接返回
 * @param fsPath 可以文件或目录
 */
export function CalcPath(fsPath: string): string {
    let stats = fs.lstatSync(fsPath),
        isDir = stats.isDirectory();

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

export function CalcImportPath(moduleFile: string, tsFile: string) {
    let mdPath = path.dirname(moduleFile);
    let tsPath = path.dirname(tsFile);
    let fileName = path.parse(tsFile).name;
    let importPath = ['.', path.relative(mdPath, tsPath), fileName].join('/');
    return importPath.replace(/\/{2,}/g, '/').replace(/(?:\.\/){2,}/g, './');
}

export function PushToImport(content: string, className: string, importPath: string, isExport: boolean): string {

    let contentList = content.replace(/\n\r/g, '\n').split('\n').reverse();
    let importRegex = /^\s*import\s+/;
    let index = contentList.findIndex(item => { return importRegex.test(item); });
    if (index < 0) {
        index = contentList.length - 1;
    }

    contentList[index] = contentList[index] + ["\nimport { ", className, " } from '", importPath, "';"].join('');
    if (isExport)
        _pushToExport(contentList, index, importPath);
    return contentList.reverse().join('\n');

}

function _pushToExport(contentList: string[], importIndex: number, importPath: string): string[] {

    let exportRegex = /^\s*export\s+\*/;
    let index = contentList.findIndex(item => { return exportRegex.test(item); });
    if (index < 0) {
        index = importIndex;
    }

    contentList[index] = contentList[index] + ["\nexport * from '", importPath, "';"].join('');
    return contentList
}

export function PushToModuleDeclarations(content: string, className: string) {

    content = content.replace(/declarations\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
            classText = classText.replace(/,/g, ',\n        ');
            classText = ['\n        ', classText, '\n    '].join('');
            return find.replace(text, classText);
        } else
            return 'declarations: [ ' + className + ' ]'
    });

    return content;
}

export function PushToModuleEntryComponents(content: string, className: string) {

    content = content.replace(/entryComponents\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
            classText = classText.replace(/,/g, ',\n        ');
            classText = ['\n        ', classText, '\n    '].join('');
            return find.replace(text, classText);
        } else
            return 'entryComponents: [ ' + className + ' ]'
    });

    return content;
}

export function PushToModuleImports(content: string, className: string) {

    content = content.replace(/imports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
            classText = classText.replace(/,/g, ',\n        ');
            classText = ['\n        ', classText, '\n    '].join('');
            return find.replace(text, classText);
        } else
            return 'imports: [ ' + className + ' ]'
    });

    return content;
}

export function PushToModuleExports(content: string, className: string) {

    content = content.replace(/exports\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
            classText = classText.replace(/,/g, ',\n        ');
            classText = ['\n        ', classText, '\n    '].join('');
            return find.replace(text, classText);
        } else
            return 'exports: [ ' + className + ' ]'
    });

    return content;
}

export function PushToModuleProviders(content: string, className: string) {

    content = content.replace(/providers\s*\:\s*\[([^\]]*)\]/m, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        if (!isEmpty) {
            let classText = text.replace(/[\r\n\s]+/g, '') + ',' + className;
            classText = classText.replace(/,/g, ',\n        ');
            classText = ['\n        ', classText, '\n    '].join('');
            return find.replace(text, classText);
        } else
            return 'providers: [ ' + className + ' ]'
    });

    return content;
}

let _routingRegex = /const\s+routes\s*:\s*Routes\s*\=\s*\[((?:\n|\r|.)*)\]\s*\;/m;
function _isRoutingModule(content: string):boolean{
    return _routingRegex.test(content);
}
function _getRoutingContent(content:string):string {
    let finds = /\s*\/\/\-\-\s*register(?:\n|\r|.)*\/\/\-\-\s*end\s+register/m.exec(content);
    return finds ? finds[0] : '';
}
function _getRoutingItems(content:string):string[]{
    let contentList = content.replace(/[\r\n]+/g, '\n').split('\n');
    let retList:string[] = [],
        temp = '';
    contentList.forEach(item=>{
        if (/^\s*\/\/\-\-\s*register/.test(item))
            temp = '';
        else if (/^\s*\/\/\-\-\s*end\s+register/.test(item))
            retList.push(temp);
        else
            temp = [temp, item].join('\n');
    });
    return retList;
}
function _makeRoutingItems(contentList:string[]):string{
    let len =contentList.length;
    let notEnd:boolean = len <= 1 ? false : /\,\s*$/.test(contentList[len-2]);
    if (notEnd)
        contentList[len-1] += ',';
    else if (len > 1){
        contentList[len-2] += ',';
    }

    let content:string = contentList.map(item=>{
        return ['    //-- register', item , '    //-- end register'].join('\n');
    }).join('\n').replace(/\n{2,}/g, '\n');
    return content;
}

export function PushToModuleRouting(content: string, name:string, className: string, importPath: string, isChild?:boolean) {

    content = content.replace(_routingRegex, function (find, text, index) {
        let isEmpty = !Lib.trim(text);
        let routingContent = _getRoutingContent(text);
        let routingItems = _getRoutingItems(routingContent);
        if (isChild){
            routingItems.push(`    {
        path: '${name}',
        loadChildren: '${importPath}#${className}'
    }`);
        } else {
            routingItems.push(`    {
        path: '${name}',
        component: ${className}
    }`);
        }
        let retContent = text.replace(routingContent,  '\n' + _makeRoutingItems(routingItems));

        if (!isEmpty) {
            return find.replace(text, retContent);
        } else
            return 'const routes: Routes = [' + retContent + '\n];'
    });

    return content;
}
