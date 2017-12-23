
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