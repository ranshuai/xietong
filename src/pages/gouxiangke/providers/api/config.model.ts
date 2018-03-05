import { HttpConfig } from './../../../../providers/HttpConfig';
import { Injectable } from '@angular/core';
@Injectable()
export class Config {

   // PLATFORM: any = 'APP';微信 WX， 店铺app STOREAPP ，店铺appWX STOREAPPWX，
  PLATFORM: any;
  constructor(public httpConfig: HttpConfig) { 
    console.log(this.httpConfig);
    if (this.httpConfig.clientType == '2') {
      if (this.httpConfig.platform == 'wx') {
        this.PLATFORM = 'STOREAPPWX';
      } else {
        this.PLATFORM = 'STOREAPP';
      }
    } else { 
      if (this.httpConfig.platform == 'wx') {
        this.PLATFORM = 'WX';
      } else {
        this.PLATFORM = 'APP';
      }
    }
    
  }
  domain = this.httpConfig.space;//购享客-JAVA
  type = this.httpConfig.clientType;//1是域 2是店铺
  platform = this.httpConfig.platform;//android  ios  wx web
  clientType = this.httpConfig.clientType;
  hostList = {
    //正式环境
    prod: {
      bl: 'https://b.snsall.com/',
      lg: 'https://l.snsall.com/',
      org: 'https://o.snsall.com/'
    },
    //测试环境
    test: {
      bl: 'https://t.b.snsall.com/',
      lg: 'https://t.l.snsall.com/',
      org: 'https://t.o.snsall.com/'
    },
    //开发环境
    dev: {
      bl: 'http://d.b.snsall.com/',
      lg: 'http://d.l.snsall.com/',
      org: 'http://d.o.snsall.com/'
    }
  };

  //测试环境,会根据headers中的数据，来切换
  host = this.httpConfig.host;
  baseUrl=window.localStorage.getItem("currentHost");
  timeout = 30 * 1000;
  timeout_long = 60 * 1000;
  version = '1.0.10';
  real: boolean = false;
  isEditor: boolean = false;
  interva = {
    "login": 60,
    "register": 60
  };
    //店铺和商城的配置信息
  CONFINFO: {
    type: 1, //商城是1， 店铺是 2
  };
  //平台 platform


  STOREID: any = this.httpConfig.storeId;//店铺ID

  //平台类型
  PLATFORMTYPE: any = '';
  // STOREID: any;
}



