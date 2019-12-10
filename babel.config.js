module.exports = process.env.NODE_ENV === 'test' ? {
    "presets": [["env", { "modules": false }]],
    "env": {
        "test": {
            "presets": [["env", { "targets": { "node": "current" } }]]
        }
    }
} : {
        presets: [
            '@vue/app'
        ]
    }