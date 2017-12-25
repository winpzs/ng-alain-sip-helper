'use strict';
import * as path from 'path';
import * as fs from 'fs';

let argv = require('yargs-parser');

import { ExtensionContext, commands, window, QuickPickItem, Terminal, workspace, env, TextDocument, Extension, Range, Position } from 'vscode';
import { SipPageComponent } from './contents/sip-page-component';
import { SipModalComponent } from './contents/sip-modal-component';
import { Lib } from './lib';
import { SipClass } from './contents/sip-class';
import { ContentBase } from './contents/content-base';
import { SipModule } from './contents/sip-module';
import { SipService } from './contents/sip-service';
import { SipDirective } from './contents/sip-directive';
import { SipPipe } from './contents/sip-pipe';
import { SipGuard } from './contents/sip-guard';

let stringify = require('json-stable-stringify');

function getCurrentPath(args): string {
    return args && args.fsPath ? args.fsPath : (window.activeTextEditor ? window.activeTextEditor.document.fileName : '');
}

function getRelativePath(args): string {
    let fsPath = getCurrentPath(args);

    let stats = fs.lstatSync(fsPath),
        isDir = stats.isDirectory();

    return isDir ? fsPath : path.parse(fsPath).dir;
}

export interface IParam {
    param: string;
    title: string;
}

export interface IConfig {
    command: string;
    title: string;
    terminal: string;
    input: boolean;
    path: string;
    builtin: boolean;
    children: IConfig[];
    params: IParam[];
}

export function activate(context: ExtensionContext) {
    //console.log(context.storagePath);


    context.subscriptions.push({
        dispose: () => {
            Object.keys(terminals).forEach(key => {
                dispose_Terminal(key);
            })
        }
    });

    let _fileName = '';
    context.subscriptions.push(commands.registerCommand('ngalainsiphelper.quickpicks', (args) => {
        let curPath = getCurrentPath(args),
            defaultName = path.basename(curPath);
        _fileName = defaultName.split('.')[0];

        let configs = getConfig();

        showQuickPick(configs, workspace.rootPath, args);

    }));

    let terminals = {};
    let send_terminal = (name: string, path: string, cmd: string) => {
        name || (name = "ng-alain-sip");
        dispose_Terminal(name);
        let terminal = terminals[name] = window.createTerminal(name);
        terminal.show(true);
        path && terminal.sendText('cd "' + path + '"');
        terminal.sendText(cmd);
    };
    let dispose_Terminal = (name: string) => {
        let terminal: Terminal = terminals[name];
        try {
            if (terminal) {
                terminals[name] = null;
                terminal.dispose();
            }
        } catch (e) {
            return;
        }
    };
    let getVarText = (text: string, params: { args: any; input: string; params: string; }): string => {
        text = text.replace(/\%currentpath\%/gi, getRelativePath(params.args));
        text = text.replace(/\%workspaceroot\%/gi, workspace.rootPath);
        text = text.replace(/\%input\%/gi, params.input);
        text = text.replace(/\%params\%/gi, params.params);
        return text;
    };
    let openFile = (file: string): PromiseLike<TextDocument> => {
        return workspace.openTextDocument(file).then(r => {
            window.showTextDocument(r);
            return r;
        });
    };
    let send_builtin = (config: IConfig, args, params: string, path: string, inputText: string) => {
        let p = argv(params || '');
        let gParam = Object.assign({
            name: inputText,
            path: path
        }, p);
        switch (config.command) {
            case 'config':
                setConfig();
                break;
            case 'npm':
                npm();
                break;
            case 'snippet-text':
                commands.executeCommand('ngalainsiphelper.tosnippettext');
                break;
            case 'json-class':
                commands.executeCommand('ngalainsiphelper.jsontoclass');
                break;
            case 'sip-generate':
                let generateConfigs: IConfig[] = require('./sip-generate.conf');
                showQuickPick(generateConfigs, workspace.rootPath, args);
                break;
            case 'sip-page':
                sipGenerate(new SipPageComponent(), gParam);
                break;
            case 'sip-modal':
                sipGenerate(new SipModalComponent(), gParam);
                break;
            case 'sip-module':
                sipGenerate(new SipModule(), gParam);
                break;
            case 'sip-service':
                sipGenerate(new SipService(), gParam);
                break;
            case 'sip-directive':
                sipGenerate(new SipDirective(), gParam);
                break;
            case 'sip-pipe':
                sipGenerate(new SipPipe(), gParam);
                break;
            case 'sip-guard':
                sipGenerate(new SipGuard(), gParam);
                break;
            case 'sip-class':
                sipGenerate(new SipClass(), gParam);
                break;
        }
    };
    let sipGenerate = (genObj: ContentBase, p: any) => {
        openFile(genObj.generate(p));
    }
    let showQuickPick = (configs: IConfig[], parentPath: string, args) => {
        let picks = configs.map(item => item.title);

        window.showQuickPick(picks).then((title) => {
            if (!title) return;
            let config: IConfig = configs.find(item => item.title == title);
            if (!config) return;
            let path = config.path ? config.path : parentPath;
            let children = config.children;
            let params = config.params;
            if (children && children.length > 0) {
                showQuickPick(children, path, args);
            } else if (params && params.length > 0) {
                showParamsQuickPick(config, path, args);
            } else {
                send_command(config.terminal, path, config.command, '', config.input, args, config);
            }
        });

    };
    let showParamsQuickPick = (config: IConfig, path: string, args) => {
        let params = config.params;
        let picks = params.map(item => item.title);

        window.showQuickPick(picks).then((title) => {
            if (!title) return;
            let param: IParam = params.find(item => item.title == title);
            let cmd = config.command;
            if (!param || !config.command) return;
            send_command(config.terminal, path, config.command, param.param, config.input, args, config);
        });
    };

    let send_command = (name: string, path: string, cmd: string, params: string, input: boolean, args, config: IConfig, inputText = '') => {
        if (!input) {
            path = getVarText(path, {
                args: args,
                input: inputText, params: params
            });
            if (config.builtin) {
                send_builtin(config, args, params, path, inputText);
            } else {
                cmd = getVarText(cmd, {
                    args: args,
                    input: inputText, params: params
                });
                send_terminal(name, path, cmd);
            }
        }
        else {
            window.showInputBox({
                prompt: '请输入文件名称？',
                value: _fileName
            }).then((fileName) => {
                if (fileName) {
                    if (/[~`!#$%\^&*+=\[\]\\';,{}|\\":<>\?]/g.test(fileName)) {
                        window.showInformationMessage('文件名称存在不合法字符!');
                    } else {
                        send_command(name, path, cmd, params, false, args, config, fileName);
                    }
                }
            },
                (error) => console.error(error));
        }
    };


    let getConfig = (): IConfig[] => {
        let fsPath = path.join(workspace.rootPath, './ng-alain-sip.conf.json');
        return (!fs.existsSync(fsPath)) ? require('./ng-alain-sip.conf') : JSON.parse(fs.readFileSync(fsPath, 'utf-8'));
    };

    let setConfig = () => {
        let fsPath = path.join(workspace.rootPath, './ng-alain-sip.conf.json');
        if (!fs.existsSync(fsPath))
            saveDefaultConfig();

        workspace.openTextDocument(fsPath).then((textDocument) => {
            if (!textDocument) return;
            window.showTextDocument(textDocument).then((editor) => {
            });
        });

    };

    let saveDefaultConfig = () => {
        let fsPath = path.join(workspace.rootPath, './ng-alain-sip.conf.json');
        let json = stringify(require('./ng-alain-sip.conf'), { space: '    ' });
        fs.writeFileSync(fsPath, json, 'utf-8');
    };

    let npm = () => {
        let fsPath = path.join(workspace.rootPath, './package.json');
        if (!fs.existsSync(fsPath)) return;
        let packageJson = JSON.parse(fs.readFileSync(fsPath, 'utf-8'));
        let scripts = packageJson.scripts;
        let scriptList = Object.keys(scripts).map(key => {
            return {
                command: 'npm run ' + key,
                title: key
            };
        });
        let picks = scriptList.map(item => item.title);

        window.showQuickPick(picks).then((title) => {
            if (!title) return;
            let item: any = scriptList.find(item => item.title == title);
            if (!item) return;
            send_terminal('npm-ngalainsiphelper', workspace.rootPath, item.command);
        });
    };

    context.subscriptions.push(commands.registerTextEditorCommand('ngalainsiphelper.tosnippettext', (textEditor, edit) => {
        var { document, selection } = textEditor
        let isEmpty = textEditor.selection.isEmpty;

        var text = isEmpty ? document.getText() : document.getText(textEditor.selection);
        text = formatSnippetText(text);
        edit.replace(isEmpty ? new Range(new Position(0, 0), new Position(100000, 100000)) :
            textEditor.selection, text);
    }))

    let formatSnippetText = (text: string): string => {

        let preLen = -1;
        text = ['["', text.replace(/(\n\r)/g, '\n').split('\n').map(item => {
            if (preLen == -1) {
                preLen = /^\s*/.exec(item)[0].length || 0;
            }
            return item.replace(/(\"|\\)/g, '\\$1').replace(/(\$)/g, '\\\\$1').substr(preLen).replace(/\t/g, '\\t');
        }).join('",\n"'), '$0"]'].join('');

        return text;
    };


    context.subscriptions.push(commands.registerTextEditorCommand('ngalainsiphelper.jsontoclass', (textEditor, edit) => {
        let { document, selection } = textEditor

        let isEmpty = textEditor.selection.isEmpty;

        let text = isEmpty ?
            document.getText() :
            document.getText(textEditor.selection);
        try {

            text = jsonToClass(JSON.parse(text));
            edit.replace(isEmpty ? new Range(new Position(0, 0), new Position(100000, 100000)) :
                textEditor.selection, text);
        } catch (e) {
            window.showErrorMessage(e.message);
        }
    }))

    let jsonToClass = (json: object): string => {

        let props = [], defs = [], item, defName;
        Object.keys(json).forEach(key => {
            item = json[key];
            if (Lib.isString(item)) {
                defName = key + ': string';
                props.push('    ' + defName + ' = "";');
            } else if (Lib.isBoolean(item)) {
                defName = key + ': boolean';
                props.push('    ' + defName + ' = false;');
            } else if (Lib.isNumeric(item)) {
                defName = key + ': number';
                props.push('    ' + defName + ' = 0;');
            } else if (Lib.isArray(item)) {
                defName = key + ': any[]';
                props.push('    ' + defName + ' = [];');
            } else {
                defName = key + ': any';
                props.push('    ' + defName + ' = null;');
            }
            defs.push(defName.replace(':', '?:'));
        });

        let classText = `export class Class1 {

${props.join('\n')}

    constructor(p?:{
        ${defs.join(';\n        ')};
    }) {
        if (p){
            Object.assign(this, p);
        }
    }
}`;

        return classText;
    };

}

