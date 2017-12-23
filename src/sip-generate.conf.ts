

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
    }
];

module.exports = gen_config;