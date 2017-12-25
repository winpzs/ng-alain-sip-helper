import * as path from 'path';
import * as fs from 'fs';

export interface GenerateParam {
    name: string;
    path: string;
    moduleFile:string;
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

export function FindModuleFile(rootPath:string, curPath:string):string{
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