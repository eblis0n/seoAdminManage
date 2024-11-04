/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-04 00:15:17
 */
// PC

export interface hostsResult {
  id: string;
  host_ip: string;
  status: number;
  host_group: string;
  ping_time: string;
  remark: string;
}

export interface hostsDel {
  id: string;
}

export interface hostsUpdate {
  id: string;
  host_group: string;
  remark: string;
}
