/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-05 16:51:43
 */
// PC

export interface hostsResult {
  id: string;
  host_ip: string;
  is_disabled: number;
  host_group: string;
  ping_time: string;
  remark: string;
  online: string;
}

export interface hostsDel {
  id: string;
}

export interface hostsUpdate {
  id: string;
  host_group: string;
  remark: string;
}
