import { Config } from './../api/config.model';
import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../api/api';
import { CommonProvider } from "../common/common";
import { RequestOptions, Headers } from '@angular/http';
import {ThirdPartyApiProvider} from "../../../../providers/third-party-api";
import {HttpConfig} from "../../../../providers/HttpConfig";
/*
  Generated class for the PayProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PayProvider {

  constructor(
    public api: Api,
    private loadingCtrl: LoadingController,
    private common: CommonProvider,
    private thirdPartyApi: ThirdPartyApiProvider,
    private httpConfig:HttpConfig,
    public config:Config
  ) { }

    /**
   * 预付款支付
   * @param orderNo  订单号
   * @param payPassWord 用户的支付密码
   * @param isAll 1是父订单 0是子订单
   */
  prepay(orderNo, payPassWord, isAll) { 
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '支付中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => { 
      loading.present();
      this.api.post(this.api.config.host.bl + 'payment/pre', {
        orderNo: orderNo,
        payPassWord: payPassWord,
        isAll:isAll
      }).subscribe(data => {
        loading.dismiss();
        observer.next(data);
      }); 
    })


  }

  balancePay(orderNo,payType,description?,payPassWord?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '支付中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.post(this.api.config.host.bl + 'payment/balance', {
        description: description || "{ parent: true }",
        orderNo: orderNo,
        payPassWord: payPassWord || "",
        payType:payType
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data);
        } else {
          this.common.showToast(data.msg || '支付失败,请稍后再试~');
        }
      });
    });
  }

  // wxPay(orderNo) {
  //   // this.common.showToast('暂未开通，敬请期待~');
  //   let loading = this.loadingCtrl.create({
  //     dismissOnPageChange: true,
  //     content: '支付中，请稍后...'
  //   });
  //   return new Observable((observer: Subscriber<any>) => {
  //     loading.present();
  //     this.api.post(this.api.config.host.bl + 'payment/charge/wx_pub/get', {
  //       orderSn: orderNo,
  //       all: true,
  //       openId: window.localStorage.openid
  //     }).subscribe(data => {
  //       loading.dismiss();
  //       if (data.success) {
  //         this.thirdPartyApi.wxPay(data.result).subscribe(data => {
  //           if (data) {
  //             observer.next(data);
  //           }
  //         });
  //       } else {
  //         this.common.showToast(data.msg || '支付失败,请稍后再试~');
  //       }
  //     });
  //   });
  // }

  // app微信支付
    /**
     * @ orderNo 订单好
     * @ type 支付类型
     * @  b 是否父订单
     */
    wxPay(orderNo, type?,b?) {
      console.log(type);
      // this.common.showToast('暂未开通，敬请期待~');
      let loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
          content: '支付中，请稍后...'
      });
      return new Observable((observer: Subscriber<any>) => {
          loading.present();
          //如果是微信调用微信js的支付
          if (this.config.PLATFORM == 'WX') {
              let options = new RequestOptions({ headers: new Headers({ orderSn: orderNo, openId: this.httpConfig.openId }) });
              this.api.get(this.api.config.host.org + 'v2/weixinPay/wxPayUnifiedorder', null, options).subscribe(data => {
                  loading.dismiss();
                  if (data.success) {
                      if(data.result == 3001){
                          this.common.showToast(data.msg)
                          return
                      }
                      let charge = data.result.weiXinPayVo;
                      // charge = JSON.stringify(charge);
                      this.thirdPartyApi.wxPay(charge).subscribe(data => {
                          if (data) {
                              observer.next(data);
                          }
                      });
                  } else {
                      this.common.showToast(data.msg || '支付失败,请稍后再试~');
                  }
              });
              return
          }
          //如果是APP 调用P++支付
          if (this.config.PLATFORM == 'APP'|| this.config.PLATFORM == 'STOREAPP') {
              this.api.post(this.api.config.host.bl + 'payment/charge/'+type+'/get', {
                  orderSn: orderNo,
                  all: b,
                  // openId: window.localStorage.openid
              }).subscribe(data => {
                  loading.dismiss();
                  if (data.success) {
                      if(data.result == 3001){
                          this.common.showToast(data.msg)
                          return
                      }
                      let charge = data.result;
                      charge = JSON.stringify(charge);
                      this.thirdPartyApi.wxPay(charge).subscribe(data => {
                          if (data) {
                              observer.next(data);
                          }
                      });
                  } else {
                      this.common.showToast(data.msg || '支付失败,请稍后再试~');
                  }
              });
              return
          }
      });
  }

  deliveryPay(orderNo,description?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '支付中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.post(this.api.config.host.bl + 'payment/delivery', {
        description: description || "{ parent: true }",
        orderNo: orderNo
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data);
        } else {
          this.common.showToast(data.msg || '支付失败,请稍后再试~');
        }
      });
    });
  }

}
