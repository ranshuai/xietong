import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { HttpService} from "../providers/HttpService";
import { NativeService } from "./NativeService";
import { CommonModel } from "./CommonModel";
import { Utils} from "./Utils";
import * as pingpp from 'pingpp-js';
import {HttpConfig} from "./HttpConfig";
declare var wx: any;
declare var AMap: any;

/*
  Generated class for the ThirdPartyApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ThirdPartyApiProvider {
  isConfig: Boolean; //判断是否注入微信配置
  constructor(
    private loadingCtrl: LoadingController,
    private nativeService: NativeService,
    private httpService: HttpService,
    private commonModel: CommonModel,
    private utils:Utils,private httpConfig:HttpConfig
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
          this.nativeService.showToast('登录融云失败~')
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
       let domain = this.httpService.config.space;
        let formData = new FormData();
        formData.append('file', _File);
        formData.append('type', type);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.httpService.config.host.bl+'upload/picture');
        xhr.setRequestHeader('space', domain);
        xhr.setRequestHeader('userId', this.commonModel.userId);
        xhr.onload = () => {
          loading.dismiss();
          let data = JSON.parse(xhr.responseText);
          if (data.success) {
            this.nativeService.showToast('上传成功~')
              console.log("上传成功,返回数据：",data);
            observer.next(data.result.unserialize[0]);
          } else {
            this.nativeService.showToast(data.msg || '上传失败~');
          }
        };
        xhr.onerror = () => {
          loading.dismiss();
          console.error(xhr);
          this.nativeService.showToast('上传失败，请稍后再试~');
        };
        loading.present();
        xhr.send(formData);
      });
  }


/**
 * 微信支付 兼容手机和移动端
 * @param charge 
 */

  wxPay(charge) {
    return new Observable((observer: Subscriber<any>) => {
      if (this.nativeService.isMobile()) {
        (<any>window)._cordovaNative && (<any>window)._cordovaNative.pay(charge);
        //给window赋事件
        (<any>window).paycall = (data) => {
          if (data.code != -1) {
            observer.next(data);
          } else {
            this.nativeService.showToast('支付失败~');
          }
          //将事件注销，防止闭包占用内存
          (<any>window).paycall = null;
        };
      } else { 
        wx.chooseWXPay({
          appId:charge.appId,
          timestamp: charge.timeStamp,
          nonceStr: charge.nonceStr,
          package: 'prepay_id=' + charge.prepayId,
          signType: charge.signType,
          paySign: charge.paySign,
          success: function (res) {
            // alert(res);
            // 支付成功后的回调函数
            // console.log('支付成功后的回调函数');
            observer.next(res);
          },
          error:function(res){
            // alert(res.msg);
            // alert("errorMSG:" + JSON.stringify(res));
          }
        });
      }
    });
  }

    /**
     * ping++ app支付|银联支付
     * @param charge
     * @returns {Observable<any>}
     */
  pingppAppPay(charge) {
    return new Observable((observer: Subscriber<any>) => {
      if (this.nativeService.isMobile()) {
        (<any>window)._cordovaNative && (<any>window)._cordovaNative.pay(charge);
        //给window赋事件
        (<any>window).paycall = (data) => {
          if (data.code != -1) {
            observer.next(data);
          } else {
            this.nativeService.showToast('支付失败~');
          }
          //将事件注销，防止闭包占用内存
          (<any>window).paycall = null;
        };
      }
    });
  }

    /**
     * ping++ web支付
     * @param orderNo
     * @param all
     * @param payAmount
     */
    pingppWebPay(orderNo,all,payAmount){
      window.location.href=this.httpConfig.baseUrl+"/assets/testPay/pay_tip.html"+
        "?openId=1&orderSn=" + orderNo+"&space="+this.httpConfig.space + "&all=" + all+"&userId="+
        this.commonModel._userId+"&payAmount="+payAmount;
    }


  /**
   * 获取地理位置
   */
  getGeolocation() {
    return new Observable((observer: Subscriber<any>) => {
      if (this.nativeService.isMobile()) { 

        try {
          if (this.httpService.config.platform == 'ios') {
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
              if (this.httpService.config.platform == 'ios') {
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
                  add: iosData.add
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
              this.nativeService.showToast('获取地理位置信息失败~');
            }
            //将事件注销，防止闭包占用内存
            (<any>window).mapcall = null;
          };
        } catch(e){ 
          observer.next({
            lon:116.4357713493,
            lat:39.9084111009
          });
        }
      } else {
        if (this.httpService.config.platform == 'wx') { 
          wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
              var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
              var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
              // var speed = res.speed; // 速度，以米/每秒计
              // var accuracy = res.accuracy; // 位置精度
              observer.next({
                lon: res.longitude,
                lat: res.latitude
              });
            },
            cancel: function (res) {
              alert('用户拒绝授权获取地理位置');
            }
          });
        } else {
        let geolocation; 
         let mapObj = new AMap.Map('geolocationMap');
          mapObj.plugin('AMap.Geolocation', function () {
              geolocation = new AMap.Geolocation({
                  enableHighAccuracy: true,//是否使用高精度定位，默认:true
                  timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                  maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                  convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                  showButton: true,        //显示定位按钮，默认：true
                  buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                  buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                  showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                  panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                  zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
              });
              mapObj.addControl(geolocation);
              geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', data => { 
              observer.next({
                lon: data.position.M,
                lat: data.position.O
              });
            });//返回定位信息
            AMap.event.addListener(geolocation, 'error', error => { 
              this.nativeService.showToast('获取地理位置信息失败~');
            });      //返回定位出错信息
          });
        }
      }
    });
  }


  /**
   * 分享
   * @param json 
   */
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
          this.nativeService.showToast('分享失败~');
        }
        //将事件注销，防止闭包占用内存
        (<any>window).sharecall = null;
      };
    })
  }



  /**
   * 第三方登录
   * @param str 
   */
  thirdPartyLogin(str?) {
    return new Observable((observer: Subscriber<any>) => {
      this.httpService.config.source = str;
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
         this.httpService.config.thirdPartyAuthorization = data;
         observer.next(data);
        } else {
          observer.next(null);
          this.nativeService.showToast('登录失败~');
        }
        //将事件注销，防止闭包占用内存        
        (<any>window).logincall = null;
      };
      // (<any>window).logincall(true);
    })
  }
 
  



  /**
   * 微信授权初始化
   */
  wechatInit() { 
    return new Observable((observer: Subscriber<any>) => { 
      this.httpService.post(this.httpService.config.host.org + 'v2/auth2/weiXinSignature', {
        space : this.httpService.config.space,
        openId: this.httpService.config.openId,
        url: window.location.href
      }).subscribe(data => {
        if (data.success) {
          data = data.result.atgVo;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.noncestr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'onMenuShareQZone',
              'startRecord',
              'stopRecord',
              'onVoiceRecordEnd',
              'playVoice',
              'pauseVoice',
              'stopVoice',
              'onVoicePlayEnd',
              'uploadVoice',
              'downloadVoice',
              'chooseImage',
              'previewImage',
              'uploadImage',
              'downloadImage',
              'translateVoice',
              'getNetworkType',
              'openLocation',
              'getLocation',
              'hideOptionMenu',
              'showOptionMenu',
              'hideMenuItems',
              'showMenuItems',
              'hideAllNonBaseMenuItem',
              'showAllNonBaseMenuItem',
              'closeWindow',
              'scanQRCode',
              'chooseWXPay',
              'openProductSpecificView',
              'addCard',
              'chooseCard',
              'openCard'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(() => {
            this.isConfig = true;
            wx.error(function (res) {
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
              console.log("errorMSG:" + JSON.stringify(res));
            });
          });
        }
        observer.next(data);
      });
    })
  }

 /**
  * 关闭微信浏览器
  */
  closeWeixin() {
    wx.closeWindow();
  }


  /**
   * 获取当前域的名称
   */
  getWechatDomainName() { 
    this.utils.setApiLoading(this.commonModel.APP_INIT['getWechatDomainName'])
    return new Observable((observer: Subscriber<any>) => { 
      this.httpService.get(this.httpService.config.host.org + 'domain/selectDomainName').subscribe(data => {
        if (data.success) {
          this.commonModel.APP_INIT['getWechatDomainName'].data = data.result || '';
          this.utils.setApiLoading(this.commonModel.APP_INIT['getWechatDomainName'], true, false)
        } else { 
          this.utils.setApiLoading(this.commonModel.APP_INIT['getWechatDomainName'], true, true)
        }
        observer.next(data);
      });
    })
  }

  /**
   * 通过openid获取用户信息
   */
  getUserIdByOpenId() {
    this.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'])
    let prams = {
      source: 'weixin',
      openId: this.httpService.config.openId
    }
    if (this.httpService.config.storeId) { 
     (prams as any).storeId=this.httpService.config.storeId
    }
    return new Observable((observer: Subscriber<any>) => { 
      this.httpService.post(this.httpService.config.host.org + 'v2/userlogin/third/openId/thridEmpower',
        null,prams).subscribe(data => {
          if (data.success) {
            let userId = data.result.userId;
            this.httpService.get(this.httpService.config.host.org + 'user/userinfo', null, {
              userId: userId
            }).subscribe(userInfo => {
              if (data.success) {
                this.commonModel.userId = userId;
                this.commonModel.TAB_INIT_USERINFO = data.result;
                this.commonModel.APP_INIT['wechatUserInfo'].data = data.result;
                this.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'], true, false)
              } else {
                this.utils.setApiLoading(this.commonModel.APP_INIT['wechatUserInfo'], true, true)
              }
              observer.next(userInfo);
            });
          } else { 
            observer.next(null);
          }     
      });
    })

   }




  /**
  微信独有的方法解决调用微信方法报错
  */
  shareWx(jsoninfo) {
    let main = () => {
      let host = 'http://'+window.localStorage.host;
      let obj = jsoninfo;
        //分享朋友  this.globalDataProvider.domainNameWX 获取域的名称
        wx.onMenuShareAppMessage({
          title:  obj['title'] || this.commonModel.APP_INIT['getWechatDomainName'].data +'平台', // 分享标题
          //desc:'让我们一起改变移动电商',
          desc: obj['desc'] || '★'+this.commonModel.APP_INIT['getWechatDomainName'].data+'!★',
          // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          link:   obj['link'],
          imgUrl: obj['imgUrl'] // 分享图标
        });
        //分享圈
        wx.onMenuShareTimeline({
          title:  obj['title']  || this.commonModel.APP_INIT['getWechatDomainName'].data +'平台',
          link:   obj['link'] ,
          imgUrl: obj['imgUrl'] 
        });
    };
    if (!this.isConfig) {
      wx.ready(() => {
        main();
      });
    } else {
      main();
    }
  }

}