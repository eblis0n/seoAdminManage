import axios from "axios";
import { errorCodeType } from "../axios/error-code-type";
import { ElMessage, ElLoading } from "element-plus";

let loading: any;
//正在请求的数量
let requestCount: number = 0;
//显示loading
const showLoading = () => {
  if (requestCount === 0 && !loading) {
    //加载中显示样式可以自行修改
    loading = ElLoading.service({
      text: "拼命加载中，请稍后...",
      background: "rgba(0, 0, 0, 0.7)",
      spinner: "el-icon-loading",
    });
  }
  requestCount++;
};
//隐藏loading
const hideLoading = () => {
  requestCount--;
  if (requestCount == 0) {
    loading.close();
  }
};

const createInstance = (apiUrl) => {
  const instance = axios.create({
    baseURL: apiUrl,
    timeout: import.meta.env.VITE_TIMEOUT,
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      showLoading();
      // 这里可以添加你的请求拦截代码
      if (config.method === "get" && config.params) {
        let url = config.url + "?";
        for (const propName of Object.keys(config.params)) {
          const value = config.params[propName];
          var part = encodeURIComponent(propName) + "=";
          if (value !== null && typeof value !== "undefined") {
            // 对象处理
            if (typeof value === "object") {
              for (const key of Object.keys(value)) {
                let params = propName + "[" + key + "]";
                var subPart = encodeURIComponent(params) + "=";
                url += subPart + encodeURIComponent(value[key]) + "&";
              }
            } else {
              url += part + encodeURIComponent(value) + "&";
            }
          }
        }
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (res: any) => {
      hideLoading();
      // 这里可以添加你的响应拦截代码
      // 未设置状态码则默认成功状态
      const code = res.data["code"] || 200;
      // 获取错误信息
      const msg =
        errorCodeType(code) || res.data["msg"] || errorCodeType("default");
      if (code === 200) {
        return Promise.resolve(res.data);
      } else {
        ElMessage.error(msg);
        return Promise.reject(res.data);
      }
    },
    (error) => {
      console.log("err" + error);
      hideLoading();
      let { message } = error;
      if (message == "Network Error") {
        message = "后端接口连接异常";
      } else if (message.includes("timeout")) {
        message = "系统接口请求超时";
      } else if (message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
      }
      ElMessage.error({
        message: message,
        duration: 5 * 1000,
      });
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createInstance;
