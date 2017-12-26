import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName, CalcImportPath, PushToImport, PushToModuleDeclarations, PushToModuleEntryComponents, PushToModuleExports } from "./content-base";
import { SipComponent } from './sip-component';

export class SipModalComponent extends SipComponent {

    contentTS(params: GenerateParam): string {

        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let template = !params.html ? `template:''` : `templateUrl: './${name}.${prefix}.html'`;
        let style = !params.style ? `styles:[]` : `styleUrls: ['./${name}.${prefix}.less']`;

        let content = `import { Component } from '@angular/core';

import { SipUiModal } from '@core/sip/extends/sip-ui';
import { EventInit } from '@core/sip/extends/decorators';
import { SipRestService } from '@core/sip/services/sip-rest.service';
import { SipUiService } from '@core/sip/services/sip-ui.service';

@Component({
    selector: 'sip-${name}',
    ${template},
    ${style}
})
export class ${className} extends SipUiModal {

    constructor(private _rest: SipRestService, private _ui: SipUiService) {
        super();
    }

    params = { id: '' };

    //等效于ngOnInit, 但可以多次使用
    @EventInit()
    private _init() {
        this.params = this.$params(this.params);
    }

    save(event) {
        this.$close(true);
    }

}
`;
        return content;
    }

    contentHtml(params: GenerateParam): string {
        let content = `<sip-modal width="500px" height="300px">
    <sip-modal-header>
        <span>标题 - [ {{params.id}} ]</span>
    </sip-modal-header>
    <sip-modal-body>
        <div>
            <p>对话框的内容</p>
            <p>对话框的内容</p>
            <p>对话框的内容</p>
            <p>对话框的内容</p>
            <p>对话框的内容</p>
        </div>
    </sip-modal-body>
    <sip-modal-footer>
        <button nz-button [nzType]="'primary'" [nzSize]="'large'" (click)="save($event)" [nzLoading]="false">
            提 交
        </button>
    </sip-modal-footer>
</sip-modal>`;
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
        content = PushToModuleEntryComponents(content, className);
        content = PushToModuleExports(content, className);

        fs.writeFileSync(moduleFile, content, 'utf-8');

    }

}