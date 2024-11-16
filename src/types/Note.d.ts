/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-16 13:50:40
 */
// PC

export interface noteInfoResult {
  id: number;
  group: string;
  adsNumber: number;
  adsID: string;
  username: string;
  email: string;
  password: string;
  proxies: string;
  useragent: string;
  cookie: string;
}
export interface noteInfoInsert {
  group: string;
  adsNumber: number;
  adsID: string;
  username: string;
  email: string;
  password: string;
  proxies: string;
  useragent: string;
  cookie: string;
}

export interface noteInfoDel {
  id: number;
}

export interface noteInfoUpdate {
  id: number;
  type: string;
  group: string;
  adsNumber: number;
  adsID: string;
  username: string;
  email: string;
  password: string;
  proxies: string;
  useragent: string;
  cookie: string;
}

export interface noteInfoRenewCookie {
  id: number;
  adsID: string;
  type: string;
}

export interface noteInfoBranchCookie {
  group: string;
}
