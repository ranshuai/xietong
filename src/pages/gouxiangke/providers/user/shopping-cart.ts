import { CommonModel } from './../../../../providers/CommonModel';
import { GlobalDataProvider } from './../global-data/global-data.model';
import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../api/api';
import { CommonProvider } from "../../providers/common/common";
import { Storage } from '@ionic/storage';

/*
  Generated class for the ShoppingCartProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ShoppingCart {

  public data: any;

  constructor(
    private api: Api,
    private loadingCtrl: LoadingController,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    public storage: Storage,
    public commonModel:CommonModel
  ) { }

  getShoppingCartInfo() {
    return new Observable(observer => {
      this.api.get(this.api.config.host.bl + 'shop/carts').subscribe(data => {
        if (data.success == true) {
          if (JSON.stringify(data.result) != '{}') {
            this.data = data.result;
            this.commonModel.shopCarNum = data.result.cartIds.length;
            console.log(this.commonModel)
            observer.next(this.data);
          } else {
            this.data = null;
            observer.next(null);
            this.commonModel.shopCarNum = '';
          }
        } else {
          this.data = null;
          observer.next(null);
        }
      });
    });
  }

  getSpecsInfo(goodsId, specsId, goodsSpec) {
    return new Observable((observer: Subscriber<any>) => {
      let url = this.api.config.host.bl + 'v2/goods/desc/' + goodsId + '/' + specsId + '/' + goodsSpec;
      this.api.get(url).subscribe(data => {
        if (data.success) {
          observer.next(data);
        }
      });
    });
  }

  add(data) {
    return new Observable((observer: Subscriber<any>) => {
      //是否有userId
        if (data.goodsNum == 0) {
          this.common.showToast('仔细瞅瞅，数量为零~');
          observer.next(false);
          return;
        }
        this.api.post(this.api.config.host.bl + 'shop/cart/1/add', {
          goodsId: data.goodsId,
          goodsSpec: data.goodsSpec,
          goodsNum: data.goodsNum,
          shareId: window.localStorage.shareId,
          isCheck: 0
        }).subscribe(data => {
          if (data.success) {
            this.getShoppingCartInfo().subscribe();
            this.common.showToast('添加购物车成功');
            observer.next(true);
          } else {
            this.common.showToast('加入购物车失败,请稍后再试');
            observer.next(false);
          }
        });
    });
  }

  delete(cartIds) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.delete(this.api.config.host.bl + 'shop/cart/delete', null, { cartIds: cartIds }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.getShoppingCartInfo().subscribe(data => {
            observer.next(data);
          });
        }
      });
    });
  }

  modify(data, noReGet?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.put(this.api.config.host.bl + 'shop/cart/modify', {
        cartId: data.cartId,
        goodsSpec: data.goodsSpec,
        goodsNum: data.goodsNum,
        check: data.check
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          if (noReGet) {
            observer.next(data);
          } else {
            this.getShoppingCartInfo().subscribe(data => {
              if (data) {
                observer.next(data);
              }
            });
          }
        } else {
          this.common.showToast(data.msg);
        }
      });
    });
  }

  modifyBatch(modifyCartVOs) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.put(this.api.config.host.bl + 'shop/cart/modify/batch', {
        modifyCartVOs: modifyCartVOs
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data);
        } else {
          this.common.showToast(data.msg);
        }
      });
    });
  }

  ready() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.get(this.api.config.host.bl + 'order/regular/prepare').subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.globalData.isGroupBuy = false;
          observer.next(data.result);
        }
      });
    });
  }

  //购物车确认下单
  order(data) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      let body: any = {
        cartIds: data.cartIds,
        leaveMessage: data.leaveMessage,
        addressId: data.addressId,
        postAge: 0,
        sourceFrom: 2,
        pick:this.commonModel.pageOrderConfirmpick //缓存读取
      };
      if (data.acitivityType) {
        body.acitivityType = data.acitivityType;
      }
      if (data.couponId) {
        body.worth = data.worth;
        body.couponId = data.couponId;
      } else if (data.goodsActivityVOS) {
        body.goodsActivityVOS = data.goodsActivityVOS;
      }
      this.api.post(this.api.config.host.bl + 'order/save', body).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.data = null;
          observer.next(data.result);
        } else {
          if (data.code == 10004) {
            //锁定下单按钮
            this.globalData.lockOrderBtn = true;
          }
          this.common.showToast(data.msg);
        }
      });
    });
  }

  //立即购买确认下单
  nowBuy(data) {
    console.log(this.commonModel);
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      let body: any = {
        addressId: data.addressId,
        goodsId: data.goodsId,
        leaveMessage: data.leaveMessage,
        goodsNum: data.goodsNum,
        goodsSpecKey: data.goodsSpecKey,
        sourceFrom: 2,
        postAge: 0,
        pickId: this.commonModel.pageOrderConfirmSelfInfo.defaultNearbySelf&&this.commonModel.pageOrderConfirmSelfInfo.defaultNearbySelf.id,
        pickName:this.commonModel.pageOrderConfirmSelfInfo.defaultNearbySelf&&this.commonModel.pageOrderConfirmSelfInfo.defaultNearbySelf.pickName
      };
      if (data.acitivityType) {
        body.acitivityType = data.acitivityType;
      }
      if (data.couponId) {
        body.worth = data.worth;
        body.couponId = data.couponId;
      } else if (data.goodsActivityVOS) {
        body.goodsActivityVOS = data.goodsActivityVOS;
      }
      this.api.post(this.api.config.host.bl + 'order/save/now', body).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data.result);
        } else {
          if (data.code == 10004) {
            //锁定下单按钮
            this.globalData.lockOrderBtn = true;
          }
          this.common.showToast(data.msg);
        }
      });
    });
  }
  //拼团生成订单
  groupBuy(data) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '确认中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.post(this.api.config.host.bl + 'order/save/group', {
        addressId: data.addressId,
        goodsId: data.goodsId,
        goodsNum: data.goodsNum,
        goodsSpecKey: data.goodsSpecKey,
        shareId: window.localStorage.shareId,
        leaveMessage: data.leaveMessage,
        promisonId: data.promisonId
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next(data.result);
        } else {
          this.common.showToast(data.msg);
        }
      });
    })
  }

}
