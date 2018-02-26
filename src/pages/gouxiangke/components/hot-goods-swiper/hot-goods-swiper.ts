import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input } from '@angular/core';
import { App, ViewController,NavController } from 'ionic-angular';
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

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private common: CommonProvider,
    public mainCtrl: MainCtrl,
    public navCtrl:NavController
  ) { 
    console.log(this.imgSpace);
  }

  goToGoodsDetailPage(item) {
    let goodsId = item.goods_id || item.goodsId;
    this.navCtrl.push('GoodsDetailPage',{ goods_id: goodsId })
  }

}
