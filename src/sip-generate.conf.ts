

const gen_config = [
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
    }
];

module.exports = gen_config;