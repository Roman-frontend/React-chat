const path = require('path');
const { mergeResolvers } = require('@graphql-tools/merge');
/* const authResolver = require('./authResolver');
const appResolver = require('./appResolver'); */
const { loadFilesSync } = require('@graphql-tools/load-files');

const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolver*')); //Ви також можете завантажувати файли із зазначеними розширеннями, установивши параметр розширень. Додавши розширення: { extensions: ['js'] } як показано

//const resolvers = [authResolver, appResolver];

module.exports = mergeResolvers(resolversArray);
