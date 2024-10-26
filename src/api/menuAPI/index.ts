/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-24 14:18:16
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

import type {
  RouteVO,
  MenuVO,
  // MenuQuery,
  // MenuForm,
  // OptionType,
} from "@/types/menu";

enum API {
  MENU_ROUTES = "/sys/menu/routes/",
  MENU_LIST = "/sys/menu/list/",
  // MENU_OPTIONS = "/sys/menu/options",
  // MENU_FORM = "/sys/menu",
}

class MenuAPI {
  static getRoutes = () => request.get<any, RouteVO[]>(API.MENU_ROUTES);

  static getMenuList = () => request.get<any, MenuVO[]>(API.MENU_LIST);

  // static getOptions = (onlyParent?: boolean) =>
  //   request.get<any, OptionType[]>(API.MENU_OPTIONS, {
  //     params: { onlyParent },
  //   });

  // static getFormData = (id: number) =>
  //   request.get<any, MenuForm>(`${API.MENU_FORM}/${id}/form`);

  // static add = (data: MenuForm) => request.post(API.MENU_FORM, data);

  // static update = (id: string, data: MenuForm) =>
  //   request.put(`${API.MENU_FORM}/${id}`, data);

  // static deleteById = (id: number) => request.delete(`${API.MENU_FORM}/${id}`);
}

export default MenuAPI;
