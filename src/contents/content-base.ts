import * as path from 'path';
import * as fs from 'fs';

export interface GenerateParam {
    name: string;
    path: string;
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
export function MakeFileName(name: string, prefix: string, ext: string):string {
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


export function CalcPath(fsPath:string):string {
    let stats = fs.lstatSync(fsPath),
    isDir = stats.isDirectory();

    return isDir ? fsPath : path.dirname(fsPath);
}

const _rootRegex = /^\.\./;
export function IsInRootPath(rootPath:string, fsPath:string):boolean{
   return !_rootRegex.test(path.relative(rootPath, fsPath));
}

 export function FindPathUpward(rootPath:string, curPath:string, name:string):string {
     let fsPath = path.join(curPath, name);
     let exists = fs.existsSync(fsPath);
     if (exists)
        return curPath;
    else{
        if (!IsInRootPath(rootPath, curPath)) return '';
        curPath = FindPathUpward(rootPath, path.dirname(curPath), name);
        return curPath;
    }
 }