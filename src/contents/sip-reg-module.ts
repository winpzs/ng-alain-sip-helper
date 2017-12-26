import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, PushToModuleDeclarations, PushToImport, CalcPath, CalcImportPath, PushToModuleExports, PushToModuleRouting, IsInModuel, IsRoutingModule, PushToModuleProviders, PushToModuleImports } from "./content-base";

export class SipRegModule implements ContentBase {


    generate(params: GenerateParam): string {
        let fsFile = params.path;
        if (!fs.existsSync(fsFile)) return;

        let fInfo = path.parse(path.parse(fsFile).name);

        let name = fInfo.name;
        let prefix = fInfo.ext;
        prefix = prefix ? prefix.substr(1) : prefix;

        this.pushToModule(fsFile, params.moduleFile, name, prefix);

    }

    pushToModule(fsFile: string, moduleFile: string, name: string, prefix: string) {
        if (!moduleFile) return;
        if (!fs.existsSync(moduleFile)) return;

        let importPath = CalcImportPath(moduleFile, fsFile);

        let className = MakeClassName(name, prefix);

        let content: string = fs.readFileSync(moduleFile, 'utf-8');
        if (IsInModuel(content, className)) return;

        let isModule = false;
        if (/component/i.test(prefix)
            || /directive/i.test(prefix)
            || /pipe/i.test(prefix)) {

            content = PushToImport(content, className, importPath, true);
            content = PushToModuleDeclarations(content, className);
            content = PushToModuleExports(content, className);

        } else if (/service/i.test(prefix)) {

            content = PushToImport(content, className, importPath, true);
            content = PushToModuleProviders(content, className);

        } else if (isModule = /module/i.test(prefix)) {

            let isRouting = /-routing$/i.test(name);
            content = PushToImport(content, className, importPath, !isRouting);
            content = PushToModuleImports(content, className);

        }

        content = PushToModuleRouting(content, name, className, importPath, isModule);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}