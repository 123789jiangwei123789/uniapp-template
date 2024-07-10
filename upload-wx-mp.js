const CI = require("miniprogram-ci")
const WxConfig = require("./src/manifest.json")
const Inquirer = require('inquirer')

const project = new CI.Project({
  appid: WxConfig['mp-weixin'].appid,
  type: "miniProgram",
  projectPath: "dist/build/mp-weixin", // uniapp打包后的路径
  privateKeyPath: `private.${WxConfig['mp-weixin'].appid}.key`, // 微信公众平台上传密钥，放在项目根目录
  ignores: ["node_modules/**/*"], // 指定需要排除的规则
});
Inquirer.prompt([
  {
    name: 'version',
    message: '请输入此次提交的版本号',
    type: 'input',
    validate: (value) => {
      if (value.trim() === '') {
        return '版本号不能为空，请重新输入';
      }
      return true;
    }
  },
  {
    name: 'desc',
    message: '请输入此次版本的描述',
    type: 'input',
    validate: function (value) {
      if (value.trim() === '') {
        return '版本描述不能为空，请重新输入';
      }
      return true;
    }
  },
]).then((answers) => {
  console.log('开始上传！')
  CI.upload({
    project, // 项目对象
    version: answers.version, // 版本号
    desc: answers.desc, // 项目描述
    // 以下配置，根据自己的【微信开发者工具本地配置】,可不改
    setting: {
      minifyWXML: true, // boolean 压缩 WXML 代码
      minifyWXSS: true, // boolean 压缩 WXSS 代码
      minifyJS: true, // boolean 压缩 JS 代码
      minify: true, // boolean 压缩所有代码，对应小程序开发者工具的 "压缩代码"
      es6: true, // boolean 对应小程序开发者工具的 "es6 转 es5"
      es7: true, // boolean 对应小程序开发者工具的 "增强编译"
      codeProtect: false, // boolean 对应小程序开发者工具的 "代码保护"
      autoPrefixWXSS: false // boolean 对应小程序开发者工具的 "样式自动补全"
    },
    robot: WxConfig['mp-weixin'].envVersion === 'release' ? 2 : 1, //robot为1发布的是体验版，2发布的是正式版本，请勿用微信开发工具发版
    onProgressUpdate: console.log // 进度更新监听函数
  })
    .then(() => {
      console.log('上传成功！')
      process.exit()
    })
    .catch((error) => {
      console.log('上传失败，原因：', error)
      process.exit(-1)
    })
}).catch((err) => {
  console.log('出现错误：', err);
})