/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:22:47
 * @LastEditTime: 2024-10-21 21:59:16
 */

export interface uploadFileParamsType {
  formData: File[]; // 多个文件的数组
  who: string; // 上传者的信息
}

// // // 公用
// // //列表
// export interface ListParamsType {}
// 接口返回结果
// export interface ListResponseModel {
//   code: number;
//   msg: string;
//   data: string[];
// }

// export interface OutputSummaryListParamsType {
//   mo: string;
//   startday: string;
//   endday: string;
// }

// export interface outputEmailDetailListParamsType {
//   outID: number;
//   taskID: string;
//   domainID: number;
// }

// export interface TabPane {
//   id: number;
//   name: string;
//   child: any[];
// }

// //分组相关
// export interface groupListParamsType {
//   level: number;
// }

// //删除
// export interface groupDelParamsType {
//   id: number;
//   level: number;
// }

// // 添加
// export interface groupInsertParamsType {
//   name: string;
//   level: number;
// }
// // 修改
// export interface groupUpdateParamsType {
//   id: number;
//   name: string;
//   level: number;
// }

// // 域名相关

// // 删除域名记录
// export interface domainDelParamsType {
//   id: number;
// }

// // 查询域名记录
// export interface domainSelectParamsType {
//   name: string;
//   groupID: string;
// }

// // 添加域名
// export interface domainInsertParamsType {
//   type: string;
//   name: string;
//   groupID: string;
//   url: string;
//   level: number;
//   example: string;
// }

// // 修改
// export interface domainUpdateParamsType {
//   id: number;
//   name: string;
//   groupID: string;
//   url: string;
//   level: number;
//   example: string;
//   state: number;
//   type: string;
//   steps: string;
//   resource: string;
// }

// export interface domainRegistrationParamsType {
//   id: number;
// }

// // email相关

// // 添加

// export interface emailInsertParamsType {
//   email: string;
//   groupID: string;
//   password: string;
//   phone: string;
//   state: number;
// }

// // 修改

// export interface emailUpdateParamsType {
//   id: number;
//   email: string;
//   groupID: string;
//   password: string;
//   phone: string;
//   state: number;
// }

// // 删除
// export interface emailDelParamsType {
//   id: number;
// }
// // 查询

// export interface emailSelectParamsType {
//   email: string;
//   groupID: string;
// }

// // 简介相关

// // 添加

// export interface presentationInsertParamsType {
//   name: string;
//   url: string;
//   content: string;
//   groupID: string;
// }

// // 修改

// export interface presentationUpdateParamsType {
//   id: number;
//   name: string;
//   url: string;
//   content: string;
//   groupID: string;
// }

// // 删除
// export interface presentationDelParamsType {
//   id: number;
// }
// // 查询

// export interface presentationSelectParamsType {
//   name: string;
//   groupID: string;
// }

// // 代理相关

// // 添加

// export interface proxyPoolInsertParamsType {
//   genre: string[];
//   address: string;
//   port: string;
//   account: string;
//   password: string;
// }

// // 修改

// export interface proxyPoolUpdateParamsType {
//   id: number;
//   genre: string[];
//   address: string;
//   port: string;
//   account: string;
//   password: string;
//   state: number;
// }

// // 删除
// export interface proxyPoolDelParamsType {
//   id: number;
// }
// // 查询

// export interface proxyPoolSelectParamsType {
//   genre: string[];
// }

// // 启动相关

// // 添加

// export interface startInsertParamsType {
//   pcurl: string;
//   pcname: string;
//   wichemail: number;
//   email: string;
//   emailG: number;
//   wichdomain: number;
//   domain: number;
//   domainG: number;
//   synopsis: string;
//   proxyPool: string;
//   avatar: string;
//   state: number;
// }

// // 修改

// export interface startUpdateParamsType {
//   id: number;

//   pcurl: string;
//   pcname: string;
//   wichemail: number;
//   email: string;
//   emailG: number;
//   wichdomain: number;
//   domain: number;
//   domainG: number;
//   synopsis: string;
//   proxyPool: string;
//   avatar: string;
//   state: number;
// }

// // 删除
// export interface startDelParamsType {
//   id: number;
// }

// // 启动
// export interface startRunParamsType {
//   id: number;
//   state: number;
// }

// export interface startExecutionParamsType {
//   id: number;
// }

// // 停止
// export interface stopRunParamsType {
//   id: number;
// }

// // 结果
// export interface startResultParamsType {
//   id: number;
// }

// // 系统配置相关

// export interface sysConfigParamsType {
//   keywords: string;
// }

// // PC
// export interface pcInsertParamsType {
//   name: string;
//   address: string;
// }

// export interface pcDelParamsType {
//   id: number;
// }

// export interface pcUpdateParamsType {
//   id: number;
//   name: string;
//   address: string;
//   state: number;
// }

// // 协议
// export interface agreementInsertParamsType {
//   name: string;
//   value: string;
//   level: number;
// }

// export interface agreementDelParamsType {
//   id: number;
// }

// export interface agreementUpdateParamsType {
//   id: number;
//   name: string;
//   value: string;
//   level: number;
// }
// export interface agreementListParamsType {
//   level: number;
// }

// //  ads

// export interface adsSelectParamsType {
//   adsID: string;
//   adsuser: string;
//   adsgroupid: string;
// }

// export interface adsDelParamsType {
//   id: number;
// }

// export interface adsUpdateParamsType {
//   id: number;
//   adsgroupid: string;
//   groupName: string;
//   adsid: string;
//   adsuser: string;
//   twuser: string;
//   twpassword: string;
//   token: string;
//   twmail: string;
//   emailpwd: string;
//   auth_token: string;
//   twcookie: string;
//   state: number;
// }

// export interface adsInsertParamsType {
//   adsgroupid: string;
//   groupName: string;
//   adsid: string;
//   adsuser: string;
//   twuser: string;
//   twpassword: string;
//   token: string;
//   twmail: string;
//   emailpwd: string;
//   auth_token: string;
//   twcookie: string;
// }

// export interface adsGroundSelectParamsType {
//   salesperson: string;
//   name: string;
// }

// export interface adsGroundDelParamsType {
//   id: number;
// }

// export interface adsGroundInsertParamsType {
//   salesperson: string;
//   name: string;
// }

// export interface adsGroundUpdateParamsType {
//   salesperson: string;
//   name: string;
// }

// export interface uploadFileParamsType {
//   formData: File;
// }

// // google
// export interface googleAuthInsertParamsType {
//   gerent: string;
//   adsid: number;
//   adsuser: string;
//   adsgroup: string;
//   client_id: string;
//   client_secret: string;
//   googleAccount: string;
//   email_pwd: string;
//   email_verify: string;
//   blogger_id: number;
// }

// export interface googleAuthUpdateParamsType {
//   id: number;
//   gerent: string;
//   adsid: number;
//   adsuser: string;
//   adsgroup: string;
//   client_id: string;
//   client_secret: string;
//   googleAccount: string;
//   email_pwd: string;
//   email_verify: string;
//   blogger_id: number;
// }

// export interface googleAuthDelParamsType {
//   id: number;
// }

// export interface googleAuthGetTokenParamsType {
//   adsuser: string;
//   client_id: string;
//   client_secret: string;
// }

// export interface googleAuthGetBatchTokenParamsType {
//   adsgroup: string;
// }

// export interface googleAuthRefreshBatchTokenParamsType {
//   adsgroup: string;
// }

// export interface googleAuthRefreshTokenParamsType {
//   adsuser: string;
//   flow: string;
//   refresh_token: string;
// }

// export interface googleAuthBloggerPostParamsType {
//   access_token: string;
//   blogger_id: string;
//   title: string;
//   content: string;
// }

// export interface googleAuthBloggerBatchPostParamsType {
//   bloggroup: string;
//   articlegroup: string;
// }

// // aiArticle
// export interface aiArticleInsertParamsType {
//   prompt: string;
//   keywords: string;
//   adsgroup: string;
//   imgage_link: string;
//   language: string;
//   trainingid: number;
//   title: string;
//   content_html: string;
//   original: string;
// }

// export interface aiArticleRewriteParamsType {
//   id: number;
//   prompt: string;
//   keywords: string;
//   adsgroup: string;
//   imgage_link: string;
//   language: string;
//   trainingid: number;
//   title: string;
//   content_html: string;
//   original: string;
// }

// export interface aiArticleDelParamsType {
//   id: number;
// }

// // aiTrain
// export interface aiTrainInsertParamsType {
//   name: string;
//   training: string;
// }

// export interface aiTrainUpdateParamsType {
//   name: string;
//   training: string;
// }

// export interface aiTrainDelParamsType {
//   id: number;
// }

// // blogger
// export interface bloggerTaskPostParamsType {
//   withchbloger: string;
//   blogerid: string;
//   blogergroup: string;
//   withchArticle: string;
//   articleid: number;
//   articlegroup: string;
//   postcount: string;
// }

// export interface bloggerPostsSelectParamsType {
//   startday: string;
//   endday: string;
// }

// export interface wpDirectoryInsertParamsType {
//   table_category: string;
//   limitNum: number;
//   domain: string;
//   wp_user: string;
//   wp_password: string;
// }

// export interface wpDirectoryUpdateParamsType {
//   id: number;
//   table_category: string;
//   group: string;
// }

// export interface wpDirectoryInsertAuthorParamsType {
//   id: number;
//   wp_user: string;
//   wp_password: string;
//   wp_email: string;
// }

// export interface wpDirectoryDeleteParamsType {
//   id: number;
// }

// export interface WpBatchInsideArticlePostParamsType {
//   group: string;
// }

// export interface wpInsideArticleInsertParamsType {
//   id: number;
// }

// export interface wpStocksArticleInsertParamsType {
//   table_category_mapping: string;
//   limitNum: string;
//   domain: string;
//   wp_user: string;
//   wp_password: string;
// }

// export interface wpBuildWebsiteParamsType {
//   url: string;
// }

// // telegraPh
// export interface telegraPhSelectParamsType {
//   startday: string;
//   endday: string;
// }

// export interface telegraPhAccountInsertParamsType {
//   short_name: string;
//   author_name: string;
// }
// export interface telegraPhCreatepagePostParamsType {
//   access_token: string;
//   author_name: string;
//   article_id: number;
//   sponsored_link: string;
//   title: string;
//   content_html: string;
// }

// export interface telegraPhBatchCreatepagePostParamsType {
//   access_token: string;
//   author_name: string;
//   article_id: number;
//   sponsored_link: string;
//   title: string;
//   content_html: string;
// }

// //行业分类
// //删除
// export interface industryDelParamsType {
//   id: number;
// }

// // 添加
// export interface industryInsertParamsType {
//   genre: string;
//   name: string;
//   level: number;
//   id: number;
// }
// // 修改
// export interface industryUpdateParamsType {
//   genre: string;
//   name: string;
//   level: number;
//   id: number;
// }

// //YouTube
// //删除
// export interface YouTubeChannelDelParamsType {
//   id: number;
// }

// // 添加
// export interface YouTubeChannelInsertParamsType {
//   sort: string;
//   channel: string;
//   user: string;
// }
// // 修改
// export interface YouTubeChannelUpdateParamsType {
//   sort: string;
//   channel: string;
//   user: string;
//   id: number;
// }

// export interface YouTubeChannelArticelParamsType {
//   channel: string;
// }

// // note 文章

// export interface noteUserInsertParamsType {
//   user: string;
//   quantity: number;
// }

// export interface noteUserDelParamsType {
//   id: number;
// }

// //note 用户
// export interface noteUserInfoInsertParamsType {
//   group: string;
//   username: string;
//   email: string;
//   password: string;
//   cookie: string;
// }

// export interface noteUserInfoUpdateParamsType {
//   id: number;
//   group: string;
//   adsid: string;
//   adsuser: string;
//   username: string;
//   email: string;
//   password: string;
//   cookie: string;
// }

// export interface noteUserPostParamsType {
//   username: string;
//   cookie: string;
// }

// export interface noteUserBatchPostParamsType {
//   group: string;
// }
// export interface noteUserInfoUpdateCookieParamsType {
//   adsuser: string;
// }

// export interface wpPushYoutubeArticelParamsType {
//   domain: string;
//   wp_user: string;
//   wp_password: string;
//   channelName: string;
//   columnsName: string;
//   wpcategory: string;
// }
