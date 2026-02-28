const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

// Exclude parent node_modules from watchFolders
config.watchFolders = [
  path.resolve(__dirname, '.'),
];

// Block parent node_modules from being processed
config.resolver.blockList = [
  new RegExp(`${path.resolve(__dirname, '..', 'node_modules')}.*`),
];

module.exports = config;
