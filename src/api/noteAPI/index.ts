/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-15 14:14:10
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  noteInfoResult,
  noteInfoInsert,
  noteInfoDel,
  noteInfoRenewCookie,
  noteInfoUpdate,
  noteInfoBranchCookie,
} from "@/types/Note.d.ts";

enum API {
  NOTE_INFO_LIST = "/note/list/",
  NOTE_INFO_INSERT = "/note/add/",
  NOTE_INFO_UPDATE = "/note/update/",
  NOTE_INFO_DELETE = "/note/delete/",
  NOTE_BATCH_GET_COOKIE = "/note/batch/cookie/",
  NOTE_BATCH_PUSH_ARTICLE = "/note/batch/article/",
}

class noteAPI {
  // 获取列表
  static requestNoteInfoList = () =>
    request.get<any, noteInfoResult[]>(API.NOTE_INFO_LIST);

  static requestNoteInfoInsert = (data: noteInfoInsert) =>
    request.post<any, noteInfoResult[]>(API.NOTE_INFO_INSERT, data);

  static requestNoteInfoUpdate = (data: noteInfoUpdate) =>
    request.post<any, noteInfoResult[]>(API.NOTE_INFO_UPDATE, data);

  static requestNoteInfoRenewCookie = (data: noteInfoRenewCookie) =>
    request.post<any, noteInfoResult[]>(API.NOTE_INFO_UPDATE, data);

  static requestNoteInfoDel = (data: noteInfoDel) =>
    request.post<any, noteInfoResult[]>(API.NOTE_INFO_DELETE, data);

  static requestNoteInfoBatchCookie = (data: noteInfoBranchCookie) =>
    request.post<any, noteInfoResult[]>(API.NOTE_BATCH_GET_COOKIE, data);
}

export default noteAPI;
