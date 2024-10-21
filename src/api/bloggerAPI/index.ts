/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-09 22:06:55
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";
import bloggerRequest from "@/utils/axios/bloggerRequest";

//引入接口类型
import type {
  bloggerPostsSelectParamsType,
  ListResponseModel,
} from "@/types/other.d.ts";

enum API {
  BLOGGER_POSTS_LIST = "/blogger/posts/list/",
  BLOGGER_POSTS_RECORDING = "/blogger/posts/recording/",
  BLOGGER_POSTS_SELECT = "/blogger/posts/select/",
}

// 获取列表
export const requestBloggerPostsList = () =>
  request.get<any, ListResponseModel>(API.BLOGGER_POSTS_LIST);

// 补入库
export const requestBloggerPostsRecording = () =>
  bloggerRequest.get<any, ListResponseModel>(API.BLOGGER_POSTS_RECORDING);

//查询接口方法
export const requestBloggerPostsSelect = (data: bloggerPostsSelectParamsType) =>
  request.post<string, ListResponseModel>(API.BLOGGER_POSTS_SELECT, data);
