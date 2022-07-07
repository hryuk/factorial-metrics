/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");
const withAntdLess = require("next-plugin-antd-less");

const pluginAntdLess = withAntdLess({
  lessVarsFilePath: "./frontend/styles/antd-variables.less",
});

const nextConfig = {
  distDir: "../.next",
  reactStrictMode: true,
};

module.exports = withPlugins([[pluginAntdLess]], nextConfig);
