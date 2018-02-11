import { Injectable } from '@angular/core';
import { LoadingController } from "ionic-angular";
import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { CommonProvider } from '../common/common';

/*
  Generated class for the GoodsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GoodsProvider {

  collectStatus: Boolean; //临时存放商品的收藏状态

  constructor(
    private api: Api,
    private common: CommonProvider,
    private loadingCtrl: LoadingController,
  ) { }

  //收藏商品
  addCollect(goodsId) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '收藏中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.post(this.api.config.host.org + 'user/collect/goods/add?goodsId=' + goodsId, { goodsId: goodsId }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next({ success: true });
        } else {
          this.common.showToast('收藏失败');
          observer.next({ success: false });
        }
      });
    });
  }

  //取消收藏
  delCollect(goodsId) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '取消中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.delete(this.api.config.host.org + 'user/collect/goods/delete', { goodsId: goodsId }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          observer.next({ success: true });
        } else {
          this.common.showToast('取消收藏失败');
          observer.next({ success: false });
        }
      });
    });
  }

}
