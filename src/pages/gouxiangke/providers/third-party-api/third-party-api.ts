import { GlobalDataProvider } from './../global-data/global-data.model';
import { Config } from './../api/config.model';
import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../api/api';
import { CommonProvider } from "../common/common";
import * as pingpp from 'pingpp-js';

/*
  Generated class for the ThirdPartyApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ThirdPartyApiProvider {

  constructor(
    private api: Api,
    private loadingCtrl: LoadingController,
    private common: CommonProvider,
    public config: Config,
    public globalDataProvider:GlobalDataProvider
  ) {

  }

  /**
   * 登录融云
   * @param data
   * @constructor
   */
  IMLogin(data){
    return new Observable((observer:Subscriber<any>)=>{
      (<any>window)._cordovaNative.loginim(data);
      //给window赋事件
      (<any>window).loginim_call = (data) => {
        if (data.code != -1) {
          observer.next(data);
        } else {
          this.common.showToast('登录融云失败~');
        }
        //将事件注销，防止闭包占用内存
        (<any>window).loginim_call = null;
      };
    });

  }

  /**
   *融云聊天
   */
  chat(data) {
    (<any>window)._cordovaNative.chat(data);
  }

  //上传图片
  uploadImage(_File, type = 'user') {
    // 功能名称 (商品 : goods; 店铺:company;店铺资质:qualification;用户:user;主题:topic;身份资质:identify;默认:default;评论:comment;圈子:circle)

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '上传中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      let domain = this.api.getDomain();
      this.api.getUserId().subscribe((userId: any) => {
        let formData = new FormData();
        formData.append('file', _File);
        formData.append('type', type);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.config.host.bl+'upload/picture');
        xhr.setRequestHeader('space', domain);
        xhr.setRequestHeader('userId', userId);
        xhr.onload = () => {
          loading.dismiss();
          let data = JSON.parse(xhr.responseText);
          if (data.success) {
            this.common.showToast('上传成功~');
            observer.next(data.result.unserialize[0]);
          } else {
            this.common.showToast(data.msg || '上传失败~');
          }
        };
        xhr.onerror = () => {
          loading.dismiss();
          console.error(xhr);
          this.common.showToast('上传失败，请稍后再试~');
        };
        loading.present();
        xhr.send(formData);
      });
    });
  }

  //微信支付
  // wxPay(charge) {
  //   return new Observable((observer: Subscriber<any>) => {
  //     pingpp.createPayment(charge, (result, err) => {
  //       if (result == "success") {
  //         observer.next(true);
  //         // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
  //       } else if (result == "fail") {
  //         // charge 不正确或者微信公众账号支付失败时会在此处返回
  //         this.common.showToast(err.msg || '支付失败~');
  //       } else if (result == "cancel") {
  //         // 微信公众账号支付取消支付
  //       }
  //     });
  //   });
  // }
  wxPay(charge) {
    return new Observable((observer: Subscriber<any>) => {
      (<any>window)._cordovaNative && (<any>window)._cordovaNative.pay(charge);
      //给window赋事件
      (<any>window).paycall = (data) => {
        if (data.code != -1) {
          observer.next(data);
        } else {
          this.common.showToast('支付失败~');
        }
        //将事件注销，防止闭包占用内存
        (<any>window).paycall = null;
      };

    });
  }
  //获取地理位置信息
  getGeolocation() {
    return new Observable((observer: Subscriber<any>) => {

      if (this.config.PLATFORMTYPE == 'IOS') {
        (<any>window).getlocation();
        

      } else { 
        //调起安卓生成的方法
        (<any>window)._cordovaNative && (<any>window)._cordovaNative.getlocation();
        //
      }
      //给window赋事件
      (<any>window).mapcall = (data) => {
        if (data.code != -1) {
          let _data: any;
          
          if (this.config.PLATFORMTYPE == 'IOS') {
            /** ios 
           * {"code":"0",
           * "latitude":"40.099020",
           * "longitude":"116.276501",
           * "add":"中国北京市昌平区"}
           */
            let iosData = JSON.parse(data)
            _data = {
              code: iosData.code,
              lat: iosData.latitude,
              lon: iosData.longitude,
              add:iosData.add
            }
            observer.next(_data);
          } else { 
            /**
           * {
           * code: 0, 
           * lat: 39.914145,
           * lon: 116.43341, 
           * add: "北京市东城区艺华胡同5号靠近中国版本图书馆"
           * }
           */
            observer.next(data);
          }
          
        } else {
          this.common.showToast('获取地理位置信息失败~');
        }
        //将事件注销，防止闭包占用内存
        (<any>window).mapcall = null;
      };
    });
  }
  //分享
  share(json) {
    let _json = '{"title":"' + json.title + '","content":"' + json.content + '","iconurl":"' + json.iconurl + '","url":"' + json.url + '"}';
    return new Observable((observer: Subscriber<any>) => {
      console.log(_json);
      (<any>window)._cordovaNative.share(_json);
      //给window赋事件
      (<any>window).sharecall = (data) => {
        if (data.code != -1) {
          observer.next(data);
        } else {
          this.common.showToast('分享失败~');
        }
        //将事件注销，防止闭包占用内存
        (<any>window).sharecall = null;
      };
    })
  }
  //第三方登录
  thirdPartyLogin(str?) {
    return new Observable((observer: Subscriber<any>) => {
      this.globalDataProvider.source = str;
      let source = { 'weixin': 1, 'qq': 2, 'weibo': 3 };
      let json = {
        "authorizetype": source[str]
      };
      let _json = JSON.stringify(json);
      (<any>window)._cordovaNative.login(_json);
      //给window赋事件
      (<any>window).logincall = (data) => {
        if (data.code != -1) {
                //第三方返回的信息
         this.globalDataProvider.thirdPartyAuthorization = data;
         observer.next(data);
         
        } else {
          this.common.showToast('登录失败~');
        }
        //将事件注销，防止闭包占用内存        
        (<any>window).logincall = null;
      };
      // (<any>window).logincall(true);
    })
  }




  /**
  微信独有的方法解决调用微信方法报错
  */
  shareWx(json) {

   }

}
