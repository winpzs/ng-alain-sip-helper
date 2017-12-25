

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
                "title": "dev"
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
        "command": "",
        "title": "ng-generate >",
        "children": [
            {
                "title": "component >",
                "command": "ng g component %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false --inline-style true --inline-template false",
                        "title": "创建目录, ts, html"
                    },
                    {
                        "param": "--flat true --spec false --inline-style true --inline-template false",
                        "title": "ts, html"
                    },
                    {
                        "param": "--flat true --spec false --inline-style true --inline-template true",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "module >",
                "command": "ng g module %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "servcie >",
                "command": "ng g service %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "directive >",
                "command": "ng g directive %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "pipe >",
                "command": "ng g pipe %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "class >",
                "command": "ng g class %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "guard >",
                "command": "ng g guard %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "interface >",
                "command": "ng g interface %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            },
            {
                "title": "enum >",
                "command": "ng g enum %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "%currentPath%",
                "input": true,
                "params": [
                    {
                        "param": "--flat false --spec false",
                        "title": "创建目录, ts"
                    },
                    {
                        "param": "--flat true --spec false",
                        "title": "ts"
                    }
                ]
            }
        ]
    },
    {
        "title": "sip-generate >",
        "command": "sip-generate",
        "builtin": true
    },
    {
        "title": "npm >",
        "command": "npm",
        "builtin": true
    },
    {
        "title": "other >",
        "command": "",
        children:[
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