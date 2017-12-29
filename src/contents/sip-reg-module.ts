import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, PushToModuleDeclarations, PushToImport, CalcPath, CalcImportPath, PushToModuleExports, PushToModuleRouting, IsInModuel, PushToModuleProviders, PushToModuleImports, RemoveFromImport, RemoveFromModuleDeclarations, RemoveFromModuleExports, RemoveFromModuleImports, RemoveFromModuleProviders, RemoveModuleEntryComponents, PushToExport, RemoveFromModuleRouting, PushToModuleEntryComponents, RemoveFromExport } from "./content-base";

export class SipRegModule implements ContentBase {


    generate(params: GenerateParam): string {
        let fsFile = params.path;
        if (!fs.existsSync(fsFile)) return;

        let fInfo = path.parse(path.parse(fsFile).name);

        let name = fInfo.name;
        let prefix = fInfo.ext;
        prefix = prefix ? prefix.substr(1) : prefix;

        if (params.cleanmodlue)
            this.removeFromModule(fsFile, params.moduleFile, name, prefix);
        else
            this.pushToModule(fsFile, params.moduleFile, name, prefix, params);

    }

    pushToModule(fsFile: string, moduleFile: string, name: string, prefix: string, params: GenerateParam) {
        if (!moduleFile) return;
        if (!fs.existsSync(moduleFile)) return;

        let importPath = CalcImportPath(moduleFile, fsFile);

        let className = MakeClassName(name, prefix);

        let content: string = fs.readFileSync(moduleFile, 'utf-8');
        let contentBak = content;

        let isComponent = false;
        if (isComponent = /component/i.test(prefix)
            || /directive/i.test(prefix)
            || /pipe/i.test(prefix)) {

            if (params.module || params.routing){
                content = PushToImport(content, className, importPath);
            }

            if (params.module){
                content = PushToExport(content, className, importPath);
                content = PushToModuleDeclarations(content, className);
                content = PushToModuleExports(content, className);

                //将SipUiModal加入到module.entryComponents
                if (isComponent){
                    let cpContent = fs.readFileSync(fsFile.replace(/\.[^\.]+$/, '.ts'), 'utf-8')
                    if (/\s+extends\s+SipUiModal\s+/.test(cpContent ))
                        content = PushToModuleEntryComponents(content, className);
                }
            }

            if (params.routing){
                content = PushToModuleRouting(content, name, className, importPath, false);
            }

        } else if (/service/i.test(prefix)) {

            if (params.module){

                content = PushToImport(content, className, importPath);
                content = PushToExport(content, className, importPath);
                content = PushToModuleProviders(content, className);
    
            }

        } else if (/module/i.test(prefix)) {

            if (params.module || params.routing){
                content = PushToImport(content, className, importPath);
                content = PushToModuleImports(content, className);
            }

            if (params.module){
                content = PushToExport(content, className, importPath);
                content = PushToModuleExports(content, className);
            }

            if (params.routing){
                content = PushToModuleRouting(content, name, className, importPath, true);
            }


        } else {
            if (params.module){
                content = PushToExport(content, className, importPath);
            }
        }

        if (contentBak != content)
            fs.writeFileSync(moduleFile, content, 'utf-8');

    }

    removeFromModule(fsFile: string, moduleFile: string, name: string, prefix: string) {
        if (!moduleFile) return;
        if (!fs.existsSync(moduleFile)) return;
        let importPath = CalcImportPath(moduleFile, fsFile);

        let className = MakeClassName(name, prefix);

        let content: string = fs.readFileSync(moduleFile, 'utf-8');
        // if (!IsInModuel(content, className)) return;

        let isModule = /module/i.test(prefix);

        let retContent = content;

        retContent = RemoveFromImport(retContent, className);
        retContent = RemoveFromExport(retContent, className, importPath);
        retContent = RemoveFromModuleDeclarations(retContent, className);
        retContent = RemoveFromModuleExports(retContent, className);
        retContent = RemoveFromModuleImports(retContent, className);
        retContent = RemoveFromModuleProviders(retContent, className);
        retContent = RemoveModuleEntryComponents(retContent, className);
        retContent = RemoveFromModuleRouting(retContent, name, className, importPath, isModule);

        if (retContent != content)
            fs.writeFileSync(moduleFile, retContent, 'utf-8');

    }

}