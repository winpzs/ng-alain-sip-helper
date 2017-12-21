'use strict';
import * as path from 'path';
import * as fs from 'fs';
import { ExtensionContext, commands, window, QuickPickItem, Terminal, workspace } from 'vscode';

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
    let getPath = (args, pathType: string, parentPath: string): string => {
        let path = '';
        switch ((pathType || '').toLowerCase()) {
            case 'currentpath':
                path = getRelativePath(args);
                break;
            case 'workspaceroot':
                path = workspace.rootPath;
                break;
            default:
                path = parentPath;
                break;
        }
        return path;
    };
    let send_builtin = (config: IConfig) => {
        switch (config.command) {
            case 'config':
                setConfig();
                break;
        }
    };
    let showQuickPick = (configs: IConfig[], parentPath: string, args) => {
        let picks = configs.map(item => item.title);

        window.showQuickPick(picks).then((title) => {
            if (!title) return;
            let config: IConfig = configs.find(item => item.title == title);
            if (!config) return;
            if (config.builtin) {
                send_builtin(config);
                return;
            }
            let path = getPath(args, config.path, parentPath);
            let children = config.children;
            let params = config.params;
            if (children && children.length > 0) {
                showQuickPick(children, path, args);
            } else if (params && params.length > 0) {
                showParamsQuickPick(config, path, args);
            } else {
                send_command(config.terminal, path, config.command, '', config.input, args);
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
            send_command(config.terminal, path, config.command, param.param, config.input, args);
        });
    };

    let send_command = (name: string, path: string, cmd: string, params: string, input: boolean, args, inputText = '') => {
        if (!input) {
            cmd = cmd.replace(/\%input\%/gi, inputText).replace(/\%params\%/gi, params);
            send_terminal(name, path, cmd);
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
                        send_command(name, path, cmd, params, false, args, fileName);
                    }
                }
            },
                (error) => console.error(error));
        }
    };


    let getConfig = (): IConfig[] => {
        let fsPath = path.join(workspace.rootPath, './ng-alain-sip.conf.json');
        return (!fs.existsSync(fsPath)) ? require('./ng-alain-sip.conf') : JSON.parse(fs.readFileSync(fsPath,'utf-8'));
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

}

