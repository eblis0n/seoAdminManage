/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-07 20:15:48
 */
// PC

export interface hostsResult {
  id: string;
  host_ip: string;
  is_disabled: string;
  host_group: string;
  ping_time: string;
  remark: string;
  online: string;
}

export interface hostDisable {
  id: string;
  is_disabled: string;
}

export interface hostsUpdate {
  id: string;
  is_disabled: string;
  host_group: string;
  remark: string;
}

export interface postTaskParams {
  host_ip: string;
  task_type: string;
  script_name: string;
  script_content: string;
}
