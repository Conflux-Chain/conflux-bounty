/**
 * @fileOverview assign webpack define plugin env into jest process.env
 * @name mount-webpack-defineplugin-envs.js
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const isJSON = require('is-json');
const webpackDefaultConfig = require('../../webpack.config.js');

const webpackEnv = webpackDefaultConfig.plugins.pop();
const { defaultValues: env } = webpackEnv;

Object.keys(env).forEach(key => {
  env[key] = isJSON(env[key]) ? JSON.parse(env[key]) : env[key];
  if (env[key] === '{}') env[key] = {};
});
Object.assign(process.env, env);
