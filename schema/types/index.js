const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files'); //When using the loadFilesSync function you can also implement your type definitions using .graphql or .gql or .graphqls files.
const { mergeTypeDefs } = require('@graphql-tools/merge');
const typesArray = loadFilesSync(path.join(__dirname, './**/*.type*'));

module.exports = mergeTypeDefs(typesArray);
