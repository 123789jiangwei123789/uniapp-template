declare type IReuqestParamsWithPage<T = Record<any, any>> = {
  pageNum?: number;
  pageSize?: number;
} & T;

/** 一般业务响应体 */
interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

/** 列表响应体 */
interface IResponseList<T = any> {
  code: number;
  msg: string;
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

interface NhRequestOptions extends UniApp.RequestOptions {
  skipVerify?: boolean; // 是否跳过token相关验证
  isShowloading?: boolean; //是否展示loading
  loadingText?: string; //加载文案
}
interface NhUploadRequestOptions extends UniApp.UploadFileOption {
  isShowloading?: boolean; //是否展示loading
  skipVerify?: boolean; // 是否跳过token相关验证
  loadingText?: string; //加载文案
}
