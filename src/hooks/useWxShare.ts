import { DefaultShareImgUrl, DefaultShareTitle } from "@/constants/common";

export const useWxShare = () => {
  //为了启用微信的分享功能，其他的终端不会生效，具体参见https://github.com/dcloudio/uni-app/issues/3097
  uni.showShareMenu({ menus: ["shareAppMessage"] });
  const shareObj = {
    title: DefaultShareTitle,
    path: "/pages/index/index", //默认首页
    imageUrl: DefaultShareImgUrl,
  };
  onLoad(() => {
    const pages = getCurrentPages(); // 获取栈实例
    const currentPage = pages[pages.length - 1]["$page"];
    if (currentPage) {
      console.log(currentPage.fullPath, "当前页面路径");
      shareObj.path = decodeURIComponent(currentPage.fullPath);
    }
  });

  onShareAppMessage(() => shareObj);
  return { shareObj, onShareAppMessage };
};
