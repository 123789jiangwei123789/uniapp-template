import { isArray, isEmpty } from "lodash-es";

/**
 * 提示方法
 * @param {String} title 提示文字
 * @param {String}  icon icon图片
 * @param {Number}  duration 提示时间
 */
export const toast = (
  title: string,
  icon: "none" | "success" | "loading" | "error" = "none",
  duration = 1500,
  complete?: () => void
) => {
  if (title) {
    uni.showToast({
      title,
      icon,
      duration,
      complete,
    });
  }
};

/**
 * 查询节点的布局位置
 * 目前此方法在支付宝小程序中无法获取组件跟节点的尺寸，为支付宝的bug(2020-07-21)
 * 解决办法为在组件根部再套一个没有任何作用的view元素
 * @param {String} selector
 * @param {Boolean} all
 **/
export const getNodeRect = (
  selector: string,
  all?: boolean
): Promise<UniApp.NodeInfo | UniApp.NodeInfo[]> => {
  return new Promise((resolve) => {
    const instance = getCurrentInstance(); // 获取组件实例
    uni
      .createSelectorQuery()
      .in(instance)
      [all ? "selectAll" : "select"](selector)
      .boundingClientRect((rect) => {
        console.log(rect, "节点信息");
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
      })
      .exec();
  });
};

/**
 * 获取跳转的data
 *  @param {String} data
 */
export const getNavigateEncodeData = (data: string) => {
  if (typeof data !== "string") return data;
  return JSON.parse(data ? decodeURIComponent(data) : "{}");
};

/**
 * 转换url
 * @param url
 * @returns
 */
export const urlToRcFile = (url: string | string[]) => {
  if (isEmpty(url)) return undefined;
  if (isArray(url)) {
    return (url as string[]).map((u) => ({ url: u }));
  }
  return [{ url }];
};

/**
 * 从数组当中根据长度获取对应长度的数据
 * @param { Array } data
 * @param { Array } index
 * @param { Array } size
 * @returns
 */
export const sliceArray = <T>(
  data: Array<any>,
  index: number = 0,
  size: number = 20
) => {
  if (!data?.length) return [];
  return data.slice(index, Math.min(size, data.length)) as T[];
};
/**
 * 防抖
 * @param fn 防抖的函数
 * @param delay 时间
 * @returns
 */
export const debounce = (fn: Function, delay: number = 300) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
