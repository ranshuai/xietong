import { CommonModel } from './../../../../providers/CommonModel';
import {Injectable} from '@angular/core';

@Injectable()
/**此文件存放 用户设置的一些数据 如果取个人中心设置的数据请在此文件中取 */
export class CommonData{
  constructor( public commonModel:CommonModel) { 

  }
  //APP配置信息
  APP_CONFIG: any;
  //个人中心 页面初始化数据
  TAB_INIT_USERINFO: any =  this.commonModel._TAB_INIT_USERINFO || {};
  //个人中心地址
  user_info_address: any;
  //个人钱包
  user_info_wallet: any;
  //个人实名认证信息
  user_info_certification: {
  };
  user_info_certification_real: boolean = false;//用户是否实名认证
  //暂存订单详情
  user_info_order: any;
  //实名认证之后跳转的页面
  USER_GOTO_CARDS: String;
}
