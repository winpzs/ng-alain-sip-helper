

const config = [
    {
        "title": "serve >",
        //指令可以使用变量 %params%, %input%, %workspaceRoot%, %currentPath%"
        "command": "npm run serve %params%",
        //vscod terminal 名称
        "terminal": "serve-ngalainsiphelper",
        //路径可以使用变量 %params%, %input%, %workspaceRoot%, %currentPath%"
        "path": "%workspaceRoot%",
        //是否需要输入内容, 并压入%input%变更
        "input": false,
        //是否内置指令
        "builtin": false,
        //指令参数(二级选择), 并压入%params%变更
        "params": [
            {
                "param": "-- -o -e=dev",
                "title": "dev",
                //vscod terminal 名称, 如果没有，取config.terminal
                "terminal": "",
                //是否需要输入内容, 并压入%input%变更, 如果没有，取config.input
                "input": false
            }, {
                "param": "-- -o --e=dev -pc=\"proxy.conf.js\"",
                "title": "dev proxy"
            }, {
                "param": "-- -o --hmr -e=hmr",
                "title": "hmr"
            }, {
                "param": "-- -o --hmr -e=hmr -pc=\"proxy.conf.js\"",
                "title": "hmr proxy"
            }
        ]
    },
    {
        "title": "build >",
        "command": "npm run build",
        "terminal": "build-ngalainsiphelper",
        "path": "%workspaceRoot%",
        "input": false,
        "params": [
            {
                "param": "",
                "title": "build"
            }, {
                "param": "-- -prod -e=prod --aot --build-optimizer",
                "title": "build aot"
            }
        ]
    },
    {
        "title": "generate >",
        "command": "",
        "builtin": false,
        children: [
            {
                "title": "page >",
                "command": "sip-page",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --html --style --dir",
                        "title": "创建目录, ts, html, style"
                    },
                    {
                        "param": "--ts --html --dir",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--html",
                        "title": "html"
                    },
                    {
                        "param": "--style",
                        "title": "style"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "modal >",
                "command": "sip-modal",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --html --style --dir",
                        "title": "创建目录, ts, html, style"
                    },
                    {
                        "param": "--ts --html --dir",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--html",
                        "title": "html"
                    },
                    {
                        "param": "--style",
                        "title": "style"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "component >",
                "command": "sip-component",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --html --dir",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--ts --html --style --dir",
                        "title": "创建目录, ts, html, style"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--html",
                        "title": "html"
                    },
                    {
                        "param": "--style",
                        "title": "style"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "module >",
                "command": "sip-module",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--routingfull",
                        "title": "routing moudle full（module和routing结合）"
                    },
                    {
                        "param": "--routing",
                        "title": "routing moudle（只做routing）"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "service >",
                "command": "sip-service",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "directive >",
                "command": "sip-directive",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "pipe >",
                "command": "sip-pipe",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "guard >",
                "command": "sip-guard",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "class >",
                "command": "sip-class",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "interface >",
                "command": "sip-interface",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "enum >",
                "command": "sip-enum",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --dir",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    }
                ]
            }
        ]
    },
    {
        "title": "注册modlue >",
        "command": "",
        children: [
            {
                "title": "注册 >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--module",
                        "title": "module"
                    },
                    {
                        "param": "--routing",
                        "title": "routing"
                    }
                ]
            },
            {
                "title": "撤消 >",
                "command": "sip-cleanmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false
            },
            {
                "title": "删除文件",
                "command": "sip-gen-del",
                "path": "%currentPath%",
                "builtin": true,
                "input": false
            }
        ]
    },
    {
        "title": "npm >",
        "command": "npm",
        "builtin": true
    },
    {
        "title": "other >",
        "command": "",
        children: [
            {
                "title": "JSON To Class",
                "command": "json-class",
                "builtin": true
            },
            {
                "title": "To Snippet Text",
                "command": "snippet-text",
                "builtin": true
            },
            {
                "title": "设置",
                "command": "config",
                "builtin": true
            }
        ]
    }
];

module.exports = config;