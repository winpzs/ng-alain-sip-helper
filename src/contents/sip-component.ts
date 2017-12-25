import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName } from "./content-base";

export class SipComponent implements ContentBase {

    generate(params: GenerateParam):string {
        let name = params.name,
            prefix = 'component';
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
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentTS(params), 'utf-8');
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
            fsFile = path.join(fsPath, MakeFileName(name, prefix+'.spec', 'ts'));
            retFile || (retFile = fsFile);
            fs.existsSync(fsFile) || fs.writeFileSync(fsFile, this.contentSpec(params), 'utf-8');
        }

        return retFile;

    }

    contentTS(params: GenerateParam): string {

        let content = ``;
        return content;
    }

    contentHtml(params: GenerateParam): string {
        let content = ``;
        return content;
    }

    contentStyle(params: GenerateParam): string {
        let content = ``;
        return content;
    }

    contentSpec(params: GenerateParam): string {
        let name = params.name;
        let prefix = 'component';
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

}