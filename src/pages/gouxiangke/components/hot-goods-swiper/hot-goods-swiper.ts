import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input } from '@angular/core';
import { App, ViewController } from 'ionic-angular';
import { GoodsDetailPage } from "../../user-common/goods-detail/goods-detail";
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the HotGoodsSwiperComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'hot-goods-swiper',
  templateUrl: 'hot-goods-swiper.html'
})
export class HotGoodsSwiperComponent {

  @Input() data: any;
  @Input() slidesPerView: number;
  @Input() spaceBetween: number;
  @Input() imgSpace: any;

  goodsDetailPage = GoodsDetailPage;

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private common: CommonProvider,
    public mainCtrl:MainCtrl
  ) { 
    console.log(this.imgSpace);
  }

  goToGoodsDetailPage(item) {
    let goodsId = item.goods_id || item.goodsId;
    this.common.goToPage(this.goodsDetailPage, { goods_id: goodsId });
  }

}
