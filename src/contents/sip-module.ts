import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, CalcImportPath, PushToImport, PushToModuleImports, PushToModuleExports, IsInModuel, PushToModuleRouting, IsRoutingModule } from "./content-base";

export class SipModule implements ContentBase {

    prefix = 'module';

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

        if (params.regmodlue) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'ts'));
            this.pushToModule(fsFile, params);
            return;
        }

        if (params.ts) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'ts'));
            retFile = fsFile;
            if (!fs.existsSync(fsFile)) {
                fs.writeFileSync(fsFile, this.contentTS(params), 'utf-8');
            }
        }

        if (params.routing) {
            let routingName = [name, 'routing'].join('-');
            fsFile = path.join(fsPath, MakeFileName(routingName, prefix, 'ts'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentRoutingTS(params), 'utf-8');
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

        let content = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [],
    providers: [],
    exports:[],
    entryComponents:[]
})
export class ${className} { }
`;
        return content;
    }

    contentRoutingTS(params: GenerateParam): string {
        let name = [params.name, 'routing'].join('-');
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const routes: Routes = [];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ${className} { }
`;
        return content;
    }

    contentSpec(params: GenerateParam): string {
        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { ${className} } from './${name}.${prefix}';

describe('${className}', () => {
    let instance: ${className};

    beforeEach(() => {
        instance = new ${className}();
    });

    it('should create an instance', () => {
        expect(instance).toBeTruthy();
    });
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

        let isRouting = IsRoutingModule(fs.readFileSync(tsFile, 'utf-8'));

        let content: string = fs.readFileSync(moduleFile, 'utf-8');
        if (IsInModuel(content, className)) return;

        content = PushToImport(content, className, importPath, false);

        content = PushToModuleImports(content, className);
        content = PushToModuleExports(content, className);
        content = PushToModuleRouting(content, name, className, importPath, isRouting);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}