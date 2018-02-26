import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";
/**
 * Generated class for the GoodsHistoryListComponent Component.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'goods-history-list',
  templateUrl: 'goods-history-list.html',
})
export class GoodsHistoryListComponent {

  @Input() data: any;

  constructor(private common: CommonProvider, public navCtrl:NavController) { }

  goToGoodsDetailPage(item) {
    this.navCtrl.push( 'GoodsDetailPage', { goods_id: item.goodsId })
  }
}
