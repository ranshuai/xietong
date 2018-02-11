import { Component, ViewChild, Input } from '@angular/core';
import { Content, LoadingController,Events } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { GlobalDataProvider } from "../../../gouxiangke/providers/global-data/global-data.model";

/**
 * Generated class for the StoreOrderListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-order-list',
  templateUrl: 'store-order-list.html'
})
export class StoreOrderListComponent {

  @ViewChild(Content) content: Content;
  @Input() view: string;
  @Input() orderSn: string;

  data: Array<any>;
  page: number = 1;
  rows: number = 10;
  hasMore: Boolean = true;

  constructor(
    private api: Api,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    private loadingCtrl: LoadingController,
    private events: Events,
  ) {

    this.events.subscribe('store-order-cancel:success', (data) => {
        console.log('取消成功初始化数据')
        this.data.splice(this.data.findIndex(item => item.orderId === data.orderId), 1)
        console.log(this.data)
    });


  }

  getData() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '获取中，请稍后...'
    });
    return new Observable((observer: Subscriber<any>) => {
      loading.present();
      this.api.get(this.api.config.host.bl + 'admin/order/orderId' + '/' + this.view, {
        orderSn: this.globalData.orderSn,
        page: this.page,
        rows: this.rows,
      }).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          if (data.result) {
            data = data.result;
          } else { 
            data = [];
          }
          if (data.length < this.rows) {
            this.hasMore = false;
          } else {
            this.hasMore = true;
          }
          if (this.page == 1) {
            this.data = data;
          } else {
            this.data = this.data.concat(data);
          }
          this.content.resize();
          this.page++;
          observer.next(true);
        } else {
          this.common.showToast(data.msg || '网络错误，请稍后再试~');
          observer.next(false);
        }
      });
    });
  }

  refresh(refresher?) {
    this.page = 1;
    this.hasMore = true;
    this.getData().subscribe(_ => {
      refresher && refresher.complete();
    });
  }

  loadMore(infiniteScroll) {
    this.getData().subscribe(_ => {
      infiniteScroll.complete();
    });
  }

  ngAfterViewInit() {
    this.getData().subscribe();
  }

}
