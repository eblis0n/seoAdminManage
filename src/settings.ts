/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 23:58:30
 * @LastEditTime: 2024-10-12 20:32:45
 */
import { SizeEnum } from "./enums/SizeEnum";
import { LayoutEnum } from "./enums/LayoutEnum";
import { ThemeEnum } from "./enums/ThemeEnum";
import { LanguageEnum } from "./enums/LanguageEnum";

const { pkg } = __APP_INFO__;

const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

const defaultSettings: AppSettings = {
  title: pkg.name,
  version: pkg.version,
  showSettings: true,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true,
  layout: LayoutEnum.LEFT,
  theme: mediaQueryList.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT,
  size: SizeEnum.DEFAULT,
  language: LanguageEnum.ZH_CN,
  themeColor: "#4080FF",
  watermarkEnabled: false,
  watermarkContent: pkg.name,
};

export default defaultSettings;
