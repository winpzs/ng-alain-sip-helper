'use strict';
import * as path from 'path';
import * as fs from 'fs';
import { ExtensionContext, commands, window,QuickPickItem, Terminal, workspace } from 'vscode'; 

function getCurrentPath(args): string {
    return args && args.fsPath ? args.fsPath : (window.activeTextEditor ? window.activeTextEditor.document.fileName : '');
}

function getRelativePath(args): string {
    let fsPath = getCurrentPath(args);

    let stats = fs.lstatSync(fsPath),
        isDir = stats.isDirectory();

    return isDir ? fsPath : path.parse(fsPath).dir;
}

export interface IGenerateConfig{
    command:string;
    title:string;
    params:Array<{param:string;title:string;}>;
}

export interface IBuildParam{
    param:string;
    title:string;
}

function config<T>(property: string, defaultValue?: T): T {
    return workspace.getConfiguration('angularclihelper').get<T>(property, defaultValue);
}

function generateConfig():Array<IGenerateConfig>{
    return config<Array<IGenerateConfig>>('generateConfig');
}

function buildParam():Array<IBuildParam>{
    return config<Array<IBuildParam>>('buildParam');
}

function serveParam():Array<IBuildParam>{
    return config<Array<IBuildParam>>('serveParam');
}

export function activate(context: ExtensionContext) {

    let build_terminal:Terminal,
        serve_terminal:Terminal,
        generate_terminal:Terminal;
    let disposeTerminal = function(terminal:Terminal){
        try{
            terminal && terminal.dispose();
        } catch(e){
            return;
        }
    }
    context.subscriptions.push({
        dispose:()=>{
            disposeTerminal(serve_terminal);
            disposeTerminal(serve_terminal);
            disposeTerminal(generate_terminal);
        }
    });

    let send_build_terminal = function (fsPath: string, cmd: string) {
        disposeTerminal(build_terminal);
        build_terminal = window.createTerminal("ng-build");
        build_terminal.show(true);
        fsPath && build_terminal.sendText('cd "' + fsPath + '"');
        build_terminal.sendText(cmd);
    };

    context.subscriptions.push(commands.registerCommand('ngalainsiphelper.quickpicks', (args) => {
        let params = buildParam(),
            picks = params.map((item) => item.title);

        let fsPath = getRelativePath(args);
        window.showQuickPick(picks).then((data) => {
                if (!data) return;
                let item = params.find((item) => item.title == data);
                if (!item) return;
                send_build_terminal(fsPath, "ng build " + item.param);
            });

    }));
    

}

