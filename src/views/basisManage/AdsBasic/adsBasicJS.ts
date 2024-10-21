/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-06-20 13:51:06
 */
// EmailJS.js

import {
  requestAdsList,
  requestAdsDel,
  requestAdsSelect,
  requestAdsInsert,
  requestAdsUpdate,
} from "@/api/adsBasicAPI/index.ts";
import { ElMessage, ElLoading } from "element-plus";
import { adsGroundListGo } from "@/views/AdsGround/adsGroundJS";
import { ref } from "vue";
// 实例化
import { getAdsGroundStore, getAdsListStore } from "@/store";
// 实例化

const adsGroundStore = getAdsGroundStore();
const adsListStore = getAdsListStore();

export async function adsListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestAdsList();

    console.log("刷新adslist", response.data);
    adsListStore.setAdsListData(response.data);
    ElMessage({
      showClose: true,
      message: "加载列表成功",
      type: "success",
    });
    loading.close();
    return response.data;
  } catch (error) {
    console.log("加载列表失败:", error);
    ElMessage({
      showClose: true,
      message: "加载列表失败",
      type: "error",
    });
    loading.close();
    return [];
  }
}

export async function addGo(data) {
  try {
    const response = await requestAdsInsert(data);
    console.log("添加数据成功", response);

    ElMessage({
      showClose: true,
      message: "添加数据成功",
      type: "success",
    });
  } catch (error) {
    console.log("添加数据失败:", error);
    ElMessage({
      showClose: true,
      message: "添加数据失败",
      type: "error",
    });
  }
}

export async function delGo(data) {
  try {
    const response = await requestAdsDel(data);
    console.log("删除成功", response);

    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
  } catch (error) {
    console.log("删除失败:", error);
    ElMessage({
      showClose: true,
      message: "删除失败",
      type: "error",
    });
  }
}

export async function updateGo(data) {
  try {
    const response = await requestAdsUpdate(data);
    console.log("更新成功", response);

    ElMessage({
      showClose: true,
      message: "更新成功",
      type: "success",
    });
  } catch (error) {
    console.log("更新失败:", error);
    ElMessage({
      showClose: true,
      message: "更新失败",
      type: "error",
    });
  }
}

export async function selectGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  const adsListStateDatare = await adsListStore.adsListDataList;
  if (adsListStateDatare.length === 0) {
    try {
      const response = await requestAdsSelect(data);

      console.log("查询成功", response);
      // await refreshList();
      ElMessage({
        showClose: true,
        message: "查询成功",
        type: "success",
      });
      loading.close();
      return response.data;
    } catch (error) {
      console.log("查询失败:", error);
      ElMessage({
        showClose: true,
        message: "查询失败",
        type: "error",
      });
    }
    loading.close();
    return [];
  }
  console.log("adsGroundStateDatare", adsListStateDatare);
  return adsListStateDatare;
}

// // 读取分组信息
export async function groupGo() {
  const adsGroundStateDatare = await adsGroundStore.adsGroundDataList;

  if (adsGroundStateDatare.length === 0) {
    const newGroup = await adsGroundListGo();
    console.log("adsGround", newGroup);
    return newGroup;
  }
  console.log("adsGroundStateDatare", adsGroundStateDatare);
  return adsGroundStateDatare;
}
