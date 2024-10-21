/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-08 21:42:21
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
// import type {
//   ListResponseModel,
//   OthersResponseModel,

// } from '@/types/other'

import type { RouteVO } from "@/types/menu";
// import type { UserInfo } from "@/utils/dts/menu"

enum API {
  MENU_ROUTES = "/sys/menu/routes/",
  // USER_INFO = '/sys/user/info/',
  // ADS_INSERT  = '/ads/insert/',
  // ADS_UPDATE = '/ads/update/',
  // ADS_SELECT = '/ads/select/',
}
class menuAPI {
  // 获取菜单路由
  static getRoutes = () => request.get<any, RouteVO[]>(API.MENU_ROUTES);
}

export default menuAPI;
