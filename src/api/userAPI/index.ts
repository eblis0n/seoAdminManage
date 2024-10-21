/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-13 16:15:37
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type { ListResponseModel } from "@/types/other";

import type { UserInfo } from "@/types/user";

enum API {
  USER_LIST = "/sys/user/list/",
  USER_INFO = "/sys/user/info/",
  // ADS_INSERT  = '/ads/insert/',
  // ADS_UPDATE = '/ads/update/',
  // ADS_SELECT = '/ads/select/',
}
class UserAPI {
  // 获取列表
  static getUserList = () => request.get<any, ListResponseModel>(API.USER_LIST);
  // 用户信息
  static getUserInfo = () => request.get<any, UserInfo>(API.USER_INFO);
}

export default UserAPI;

// export const requestADSList = (params: ListParamsType) => request.get<any, ListResponseModel>(API.ADS_LIST, { params });
//删除接口方法
// export const requestAdsDel = (data: adsDelParamsType) => request.post<string, OthersResponseModel>(API.ADS_DEL, data)

// //查询接口方法
// export const requestAdsSelect = (data: adsSelectParamsType) => request.post<string, ListResponseModel>(API.ADS_SELECT, data)

// //添加接口方法
// export const requestAdsInsert = (data: adsInsertParamsType) => request.post<string, OthersResponseModel>(API.ADS_INSERT, data)
// //修改接口方法
// export const requestAdsUpdate = (data: adsUpdateParamsType) => request.post<string, OthersResponseModel>(API.ADS_UPDATE, data)
