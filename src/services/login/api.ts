import { toast } from "@/utils";

export const wxLogin = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin", //使用微信登录
      onlyAuthorize: true,
      success: (loginRes) => {
        console.log(loginRes.code);
        //todo请求后端登录接口，在获取之前清除token相关数据, 获取token，并存储
        resolve("XXX"); //resolve出登录标识
      },
      fail: (err) => {
        toast("登录参数获取失败");
        reject(err);
      },
    });
  });
};
