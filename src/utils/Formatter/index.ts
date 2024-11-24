/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-11-23 15:27:32
 * @LastEditTime: 2024-11-23 16:14:31
 */
// Formatter.ts

// 定义类型
export type Genre = "0" | "1" | "2";
export type Sort = "0" | "1";
export type online = "0" | "1";
export type is_disabled = "0" | "1";
export type Group = "0" | "1";
export type isAI = "0" | "1";
export type commission = "0" | "1";

const commissionMap: Record<commission, string> = {
  "0": "是",
  "1": "否",
};
const isAIMap: Record<isAI, string> = {
  "0": "是",
  "1": "否",
};
const groupMap: Record<Group, string> = {
  "0": "本地",
  "1": "服务器",
};
// 定义映射
const genreMap: Record<Genre, string> = {
  "0": "重定向",
  "1": "镜像",
  "2": "留痕",
};

const sortMap: Record<Sort, string> = {
  "0": "拼接",
  "1": "不拼接",
};

// ##########################

const onlineMap: Record<online, string> = {
  "0": "在线",
  "1": "离线",
};

const disabledMap: Record<is_disabled, string> = {
  "0": "上架",
  "1": "下架",
};

// 通用格式化函数
export const formatByMap = <T extends string>(
  key: T,
  map: Record<T, string>
): string => {
  return map[key] || "未知";
};

// 封装具体函数

export const formatCommission = (row: { commission: commission }): string =>
  formatByMap(row.commission, commissionMap);

export const formatisAI = (row: { isAI: isAI }): string =>
  formatByMap(row.isAI, isAIMap);

export const formatGroup = (row: { group: Group }): string =>
  formatByMap(row.group, groupMap);

export const formatGenre = (row: { genre: Genre }): string =>
  formatByMap(row.genre, genreMap);

export const formatSort = (row: { sort: Sort }): string =>
  formatByMap(row.sort, sortMap);

export const formatdisabledMap = (row: { is_disabled: is_disabled }): string =>
  formatByMap(row.is_disabled, disabledMap);

export const formatOnline = (row: { online: online }): string =>
  formatByMap(row.online, onlineMap);
