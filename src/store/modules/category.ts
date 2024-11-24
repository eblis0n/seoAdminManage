/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-25 22:19:55
 * @LastEditTime: 2024-11-22 19:56:15
 */
import categoryAPI from "@/api/categoryAPI";
import type { categoryResult } from "@/types/category";

import { store } from "@/store";

export const useCategoryformsStore = defineStore("categoryformsforms", () => {
  const categoryforms = ref<categoryResult[]>([]);

  function fetchCategoryforms() {
    return new Promise<void>((resolve, reject) => {
      categoryAPI
        .requestCategoryList()
        .then((data) => {
          categoryforms.value = data;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    categoryforms,
    fetchCategoryforms,
  };
});

export function useCategoryformsHook() {
  return useCategoryformsStore(store);
}
