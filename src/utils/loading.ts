let loadingNum = 0;

export const showLoading = (text = "加载中...") => {
  console.log("当前loadingNum数目", loadingNum);
  if (loadingNum === 0) {
    uni.showLoading({ title: text });
  }
  loadingNum++;
};
export const hideLoading = () => {
  if (loadingNum <= 0) return;
  loadingNum--;
  if (loadingNum === 0) uni.hideLoading();
};
