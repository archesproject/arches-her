const Path = require('path');
const projectPath =  Path.parse(__dirname)['dir'];

const projectNodeModulesAliases = JSON.stringify({
    // "example-node-module": "Path.resolve(__dirname, `${projectPath}/media/node_modules/example-node-module`)",
});

module.exports = {
    PROJECT_NODE_MODULES_ALIASES: projectNodeModulesAliases,
}