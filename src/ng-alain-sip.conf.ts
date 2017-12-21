

const config = [
    {
        "title": "serve",
        "command": "npm run serve %params%",
        "terminal": "serve-ngalainsiphelper",
        "path": "workspaceRoot",
        "input": false,
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
        "title": "build",
        "command": "npm run build",
        "terminal": "build-ngalainsiphelper",
        "path": "workspaceRoot",
        "input": false,
        "children": [
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
        "title": "ng-generate",
        "children": [
            {
                "title": "component",
                "command": "ng g component %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "module",
                "command": "ng g module %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "servcie",
                "command": "ng g service %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "directive",
                "command": "ng g directive %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "pipe",
                "command": "ng g pipe %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "class",
                "command": "ng g class %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "guard",
                "command": "ng g guard %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "interface",
                "command": "ng g interface %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
                "title": "enum",
                "command": "ng g enum %input% %params%",
                "terminal": "generate-ngalainsiphelper",
                "path": "currentPath",
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
        "command": "",
        "title": "other",
        "children": [
            {
                "command": "config",
                "title": "设置",
                "builtin": true
            }
        ]
    }
];

module.exports = config;