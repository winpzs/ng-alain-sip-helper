import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, PushToModuleDeclarations, PushToImport, CalcPath, CalcImportPath, PushToModuleExports, PushToModuleRouting } from "./content-base";

export class SipComponent implements ContentBase {

    prefix = 'component';

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

        if (params.html) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'html'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentHtml(params), 'utf-8');
        }

        if (params.style) {
            fsFile = path.join(fsPath, MakeFileName(name, prefix, 'css'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentStyle(params), 'utf-8');
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

        let template = !params.html ? `template:''` : `templateUrl: './${name}.${prefix}.html'`;
        let style = !params.style ? `styles:['']` : `styleUrls: ['./${name}.${prefix}.less']`;

        let content = `import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'sip-${name}',
    ${template},
    ${style}
})
export class ${className} implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
`;
        return content;
    }

    contentHtml(params: GenerateParam): string {
        let content = `<p>
    aaaa works!
</p>`;
        return content;
    }

    contentStyle(params: GenerateParam): string {
        let content = ``;
        return content;
    }

    contentSpec(params: GenerateParam): string {
        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let content = `import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ${className} } from './${name}.${prefix}';

describe('${className}', () => {
    let component: ${className};
    let fixture: ComponentFixture<${className}>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [${className}]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(${className});
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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

        let content: string = fs.readFileSync(moduleFile, 'utf-8');

        content = PushToImport(content, className, importPath, true);

        content = PushToModuleDeclarations(content, className);
        content = PushToModuleExports(content, className);

        content = PushToModuleRouting(content, name, className, importPath);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}