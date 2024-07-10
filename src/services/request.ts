import { toast } from "@/utils";
import { wxLogin } from "./login";
import { showLoading, hideLoading } from "@/utils/loading";

// 是否正在刷新token的标记
let isRefreshing = false;
// 等待请求队列
let waitingRequests: Function[] = [];

const refreshToken = async () => {
  console.log("测试");
  isRefreshing = true;
  await wxLogin();
  isRefreshing = false;
  waitingRequests.map((ak) => ak());
  waitingRequests = [];
};

export const baseRequest = <T>(
  options: NhRequestOptions | NhUploadRequestOptions,
  type: "normal" | "upload" = "normal"
) => {
  const {
    timeout = 10000,
    skipVerify = true,
    isShowloading = true,
    loadingText,
  } = options;
  options.timeout = timeout;
  const headers: Record<string, any> = {};
  if (skipVerify) {
    //鉴权处理
    // headers["authorization"] = ’XXXXXXX‘;
    // options.header = { ...options.header, ...headers };
  }
  console.log(
    `${options.url}【请求参数】`,
    type === "upload" || (options as NhRequestOptions).data
  );
  options.url = `${
    /^(http|https):\/\//.test(options.url)
      ? options.url
      : import.meta.env.VITE_REQUEST_URL + options.url
  }`;
  isShowloading && showLoading(loadingText);
  return new Promise<T>((resolve, reject) => {
    options.success = (response: any) => {
      isShowloading && hideLoading();
      const res = type === "upload" ? JSON.parse(response.data) : response.data;
      if (response.statusCode === 200) {
        const { code, msg } = res;
        console.log(`${options.url}【获取的数据】`, res);
        switch (code) {
          case 200:
            resolve(res as T);
            return;
          case 1000001:
            //刷新token
            waitingRequests.push(() => {
              resolve(baseRequest(options));
            });
            if (!isRefreshing) {
              refreshToken();
            }
            return;
          default:
            break;
        }
        toast(msg);
        reject(res as T);
      } else {
        toast("请求异常，请稍后重试");
        reject(response);
      }
    };
    options.fail = (msg) => {
      isShowloading && hideLoading();
      toast("网络连接失败，请稍后重试");
      console.error(`${options.url}【失败原因】`, msg);
      reject(msg);
    };
    type === "upload"
      ? uni.uploadFile(options as NhUploadRequestOptions)
      : uni.request(options as NhRequestOptions);
  });
};

export const postJSON = <T>(options: NhRequestOptions) => {
  return baseRequest<T>({
    method: "POST",
    header: { "Content-Type": "application/json" },
    ...options,
  });
};

export const uploadFile = <T>(options: NhUploadRequestOptions) => {
  return baseRequest<T>(
    {
      timeout: 60 * 1000,
      loadingText: "上传中...",
      ...options,
    },
    "upload"
  );
};

export const get = <T>(options: NhRequestOptions) => {
  return baseRequest<T>({
    method: "GET",
    ...options,
  });
};
