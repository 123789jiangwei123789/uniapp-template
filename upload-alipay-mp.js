const { minidev } = require('minidev')
const AliConfig = require("./src/manifest.json")
const Inquirer = require('inquirer')

Inquirer.prompt([
  {
    name: 'version',
    message: '请输入此次提交的版本号',
    type: 'input',
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
  minidev
    .upload({
      appId: AliConfig['mp-alipay'].appid, 
      project: 'dist/build/mp-alipay', // uniapp打包后的路径
      experience: AliConfig['mp-alipay'].envVersion === 'trial', // 是否设置为体验版
      version: answers.version, // 版本号
      versionDescription: answers.desc // 版本描述
    })
    .then(() => {
      console.log('上传成功！')
      process.exit()
    })
    .catch((error) => {
      console.log('上传失败，原因：', error)
      process.exit(-1)
    })
})
