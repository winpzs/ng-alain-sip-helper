

const config = [
    {
        "title": "Serve >",
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
                "title": "Dev",
                //vscod terminal 名称, 如果没有，取config.terminal
                "terminal": "",
                //是否需要输入内容, 并压入%input%变更, 如果没有，取config.input
                "input": false
            }, {
                "param": "-- -o --e=dev -pc=\"proxy.conf.js\"",
                "title": "Dev Proxy"
            }, {
                "param": "-- -o --hmr -e=hmr",
                "title": "HMR"
            }, {
                "param": "-- -o --hmr -e=hmr -pc=\"proxy.conf.js\"",
                "title": "HMR Proxy"
            }
        ]
    },
    {
        "title": "Build >",
        "command": "npm run build",
        "terminal": "build-ngalainsiphelper",
        "path": "%workspaceRoot%",
        "input": false,
        "params": [
            {
                "param": "",
                "title": "Build"
            }, {
                "param": "-- -prod -e=prod --aot --build-optimizer",
                "title": "Build AOT"
            }
        ]
    },
    {
        "title": "Generate >",
        "command": "",
        "builtin": false,
        'children': [
            {
                "title": "Page >",
                "command": "sip-page",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --html --dir",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--ts --html --less --dir",
                        "title": "创建目录, ts, html, less"
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
                        "param": "--less",
                        "title": "less"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "Modal >",
                "command": "sip-modal",
                "path": "%currentPath%",
                "builtin": true,
                "input": true,
                "params": [
                    {
                        "param": "--ts --html --dir",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--ts --html --less --dir",
                        "title": "创建目录, ts, html, less"
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
                        "param": "--less",
                        "title": "less"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "Component >",
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
                        "param": "--ts --html --less --dir",
                        "title": "创建目录, ts, html, less"
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
                        "param": "--less",
                        "title": "less"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "Module >",
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
                        "param": "--ts --routing --dir",
                        "title": "创建目录, ts, Routing"
                    },
                    {
                        "param": "--ts",
                        "title": "ts"
                    },
                    {
                        "param": "--ts --routing",
                        "title": "ts, Routing"
                    },
                    {
                        "param": "--routing",
                        "title": "Routing"
                    },
                    {
                        "param": "--spec",
                        "title": "spec"
                    }
                ]
            },
            {
                "title": "Service >",
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
                "title": "Directive >",
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
                "title": "Pipe >",
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
                "title": "Guard >",
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
                "title": "Class >",
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
                "title": "Interface >",
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
                "title": "Enum >",
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
        "title": "注册 Modlue >",
        "command": "",
        'children': [
            {
                "title": "Module >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--module",//params: module,routing, both, export(是否自动生成export)
                        "title": "Module"
                    }
                ]
            },
            {
                "title": "Routing >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--routing",
                        "title": "Routing"
                    }
                ]
            },
            {
                "title": "Module And Routing >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--both",
                        "title": "Module And Routing"
                    }
                ]
            },
            {
                "title": "撤消 Module >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--cleanmodule",
                        "title": "Module"
                    }
                ]
            },
            {
                "title": "撤消 Routing >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--cleanrouting",
                        "title": "Routing"
                    }
                ]
            },
            {
                "title": "撤消 Module And Routing >",
                "command": "sip-regmodlue",
                "path": "%currentPath%",
                "builtin": true,
                "input": false,
                "params": [
                    {
                        "param": "--cleanboth",
                        "title": "Module And Routing"
                    }
                ]
            }
        ]
    },
    {
        "title": "Npm >",
        "command": "npm",
        "builtin": true
    },
    {
        "title": "Other >",
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
                "title": "Region Block",
                "command": "region",
                "builtin": true
            },
            {
                "title": "设 置",
                "command": "config",
                "builtin": true
            }
        ]
    }
];

module.exports = config;