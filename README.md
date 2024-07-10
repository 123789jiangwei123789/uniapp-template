### 运行与发布注意事项 以下以微信小程序为例子

### 多小程序发布只需要更改 env 对应的 appid 即可

### 运行(运行哪个终端，就对应后面的标识)

pnpm dev:mp-weixin

### 编译发布正式环境，小程序版本控制见 upload-wx-mp.js（目前微信小程序支持自动发布微信后台，其他参见其 CI 支持）

pnpm build:mp-weixin:test  （自动发布体验版本，一般是ci机器人1发布的版本）
pnpm build:mp-weixin    （发布供微信审核的版本，需要去后台提交审核，一般是ci机器人2发布的版本）

### 针对于支付宝小程序自动化上传部署，官方也提供了 cli 工具 minidev，具体看文档

对于获取密钥强烈推荐执行 minidev login 扫码授权，可快速登录
https://opendocs.alipay.com/mini/02qh1f?pathHash=0b032993
获取密钥https://opendocs.alipay.com/mini/02q29w?pathHash=dad1b6ca

### 至于工程格式规范限制，自由添加