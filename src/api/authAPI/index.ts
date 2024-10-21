/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-11 13:19:38
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

import type { LoginData, LoginResult } from "@/types/auth";

enum API {
  USER_LOGIN = "/sys/user/login/",
  USER_LOGOUT = "/sys/user/logout/",
}
class AuthAPI {
  // 登录
  static getLogin = (data: LoginData) =>
    request.post<string, LoginResult>(API.USER_LOGIN, data);
  // 登出
  static getLogout = () => request.delete(API.USER_LOGOUT);
}

export default AuthAPI;
