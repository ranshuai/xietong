import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from "../../../../gouxiangke/providers/api/api";
import { ShoppingCart } from "../../../../gouxiangke/providers/user/shopping-cart";
import { CommonProvider } from "../../../../gouxiangke/providers/common/common";

/**
 * Generated class for the StoreGoodsSpecsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-goods-specs',
  templateUrl: 'store-goods-specs.html',
})
export class StoreGoodsSpecsPage {

  goods: any; //从参数中获取的goods，然后通过goodsId获取商品详情
  goodsInfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private api: Api,
    private shoppingCart: ShoppingCart,
    private common: CommonProvider,
  ) {
    let goods = this.goods = navParams.get('goods');
    //获取商品详情
    this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + goods.goodsId).subscribe(data => {
      if (data.success) {
        this.goodsInfo = data.result;
        this.goodsInfo.tpSpecGoodsPrice = this.goodsInfo.tpSpecGoodsPrices; //返回字段多了一个s，修正
      }
    });
  }

  //关闭modal
  closeModal() {
    this.viewCtrl.dismiss();
  }

  stopProp(event) {
    event.stopPropagation();
  }

}
