/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-13 16:36:29
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type { pcDel, pcUpdate, pcInsert, pcResult } from "@/types/pc.d.ts";

enum API {
  PCSETTING_LIST = "/client/list/",
  PCSETTING_DEL = "/client/delete/",
  PCSETTING_INSERT = "/client/insert/",
  PCSETTING_UPDATE = "/client/update/",
}

class pcAPI {
  // PC客户端相关
  // 获取pc客户端列表
  static requestPcList = () => request.get<any, pcResult[]>(API.PCSETTING_LIST);

  //删除接口方法
  static requestPcDel = (data: pcDel) =>
    request.post<any, pcResult[]>(API.PCSETTING_DEL, data);

  //添加接口方法
  static requestPcInsert = (data: pcInsert) =>
    request.post<any, pcResult[]>(API.PCSETTING_INSERT, data);

  //修改接口方法
  static requestPcUpdate = (data: pcUpdate) =>
    request.post<any, pcResult[]>(API.PCSETTING_UPDATE, data);
}

export default pcAPI;
