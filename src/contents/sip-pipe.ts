import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, CalcImportPath, PushToImport, PushToModuleDeclarations, PushToModuleExports } from "./content-base";

export class SipPipe implements ContentBase {

    prefix = 'pipe'

    generate(params: GenerateParam):string {
        let name = params.name,
            prefix = this.prefix;
        let fsPath = params.path;
        fsPath = params.dir ? path.join(fsPath, name) : fsPath;

        if (!fs.existsSync(fsPath)){
            fs.mkdirSync(fsPath);
        }

        let retFile = '',
            fsFile;

        if (params.ts){
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'ts'));
            retFile = fsFile;
            if (!fs.existsSync(fsFile)) {
                fs.writeFileSync(fsFile, this.contentTS(params), 'utf-8');
                this.pushToModule(fsFile, params);
            }
        }

        if (params.spec) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix+'.spec', 'ts'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentSpec(params), 'utf-8');
        }

        return retFile;

    }

    contentTS(params: GenerateParam): string {
        let name = params.name;
        name = MakeClassName(name, '');

        let content = `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: '${name}'
})
export class ${name}Pipe implements PipeTransform {

    transform(value: any, args?: any): any {
        return null;
    }

}
`;
        return content;
    }

    contentSpec(params: GenerateParam): string {
        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { ${className} } from './${name}.${prefix}';

describe('${className}', () => {
    it('create an instance', () => {
        const pipe = new ${className}();
        expect(pipe).toBeTruthy();
    });
});
`;
        return content;
    }

    pushToModule(tsFile:string, params: GenerateParam) {
        let moduleFile = params.moduleFile;
        if (!moduleFile) return;
        if (!fs.existsSync(moduleFile)) return;

        let importPath = CalcImportPath(moduleFile, tsFile);

        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content: string = fs.readFileSync(moduleFile, 'utf-8');

        content = PushToImport(content, className, importPath, true);

        content = PushToModuleDeclarations(content, className);
        content = PushToModuleExports(content, className);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}