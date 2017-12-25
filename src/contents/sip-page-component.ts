import * as path from 'path';
import * as fs from 'fs';

import { ContentBase, GenerateParam, MakeFileName, MakeClassName } from "./content-base";
import { SipComponent } from './sip-component';

export class SipPageComponent extends SipComponent {

    contentTS(params: GenerateParam): string {

        let name = params.name;
        let prefix = this.prefix;
        let className = MakeClassName(name, prefix);

        let template = !params.html ? `template:''` : `templateUrl: './${name}.${prefix}.html'`;
        let style = !params.style ? `styles:['']` : `styleUrls: ['./${name}.${prefix}.less']`;

        let content = `import { Component } from '@angular/core';

import { EventInit } from '@core/sip/extends/decorators';
import { SipUiPage } from '@core/sip/extends/sip-ui';
import { SipRestService } from '@core/sip/services/sip-rest.service';
import { SipUiService } from '@core/sip/services/sip-ui.service';

@Component({
    selector: 'sip-${name}',
    ${template},
    ${style}
})
export class ${className} extends SipUiPage {

    constructor(private _rest: SipRestService, private _ui: SipUiService) {
        super();
    }

    params = { id: '' };

    //等效于ngOnInit, 但可以多次使用
    @EventInit()
    private _init() {
        this.params = this.$params(this.params);
    }

}
`;
        return content;
    }

    contentHtml(params: GenerateParam): string {
        let content = `<sip-page>
    <sip-page-header navigator="导航标题">
        <ng-template #title>页面标题</ng-template>
        <ng-template #desc>
            页面描述
        </ng-template>
    </sip-page-header>

    <sip-page-body>
        页面内容
    </sip-page-body>
</sip-page>`;
        return content;
    }

}