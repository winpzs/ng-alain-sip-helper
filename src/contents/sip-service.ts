import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, CalcImportPath, PushToImport, PushToModuleProviders } from "./content-base";

export class SipService implements ContentBase {

    prefix = 'service'

    generate(params: GenerateParam): string {
        let name = params.name,
            prefix = this.prefix;
        let fsPath = params.path;
        fsPath = params.dir ? path.join(fsPath, name) : fsPath;

        if (!fs.existsSync(fsPath)) {
            fs.mkdirSync(fsPath);
        }

        let retFile = '',
            fsFile;

        if (params.ts) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'ts'));
            retFile = fsFile;
            if (!fs.existsSync(fsFile)) {
                fs.writeFileSync(fsFile, this.contentTS(params), 'utf-8');
                this.pushToModule(fsFile, params);
            }
        }

        if (params.spec) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix + '.spec', 'ts'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentSpec(params), 'utf-8');
        }

        return retFile;

    }

    contentTS(params: GenerateParam): string {
        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { Injectable } from '@angular/core';

@Injectable()
export class ${className} {

    constructor() { }

}
`;
        return content;
    }

    contentSpec(params: GenerateParam): string {
        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { TestBed, inject } from '@angular/core/testing';

import { ${className} } from './${name}.${prefix}';

describe('${className}', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [${className}]
        });
    });

    it('should be created', inject([${className}], (service: ${className}) => {
        expect(service).toBeTruthy();
    }));
});
`;
        return content;
    }

    pushToModule(tsFile: string, params: GenerateParam) {
        let moduleFile = params.moduleFile;
        if (!moduleFile) return;
        if (!fs.existsSync(moduleFile)) return;

        let importPath = CalcImportPath(moduleFile, tsFile);

        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content: string = fs.readFileSync(moduleFile, 'utf-8');

        content = PushToImport(content, className, importPath, true);

        content = PushToModuleProviders(content, className);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}