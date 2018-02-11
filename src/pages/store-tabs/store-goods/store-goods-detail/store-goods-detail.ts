import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from "ionic-angular";
import { Api } from "../../../gouxiangke/providers/api/api";
import { CommonProvider } from "../../../gouxiangke/providers/common/common";
import { StoreGoodsSpecsPage } from "./store-goods-specs/store-goods-specs";

/**
 * Generated class for the StoreGoodsDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-goods-detail',
  templateUrl: 'store-goods-detail.html',
})
export class StoreGoodsDetailPage {

  storeGoodsSpecsPage = StoreGoodsSpecsPage;

  goodsId: string;
  other;
  goodsInfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private modalCtrl: ModalController,
    private common: CommonProvider,
  ) {
    this.goodsId = navParams.get('goods_id');
    this.other = navParams.get('other');
  }

  ionViewDidLoad() {
    this.getInfo();
  }

  getInfo() {
    this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + this.goodsId).subscribe(data => {
      if (data.success && data.result.goodsName) {
        this.goodsInfo = data.result;
      }
    });
  }

  openSpecsModal() {
    let specsModal = this.modalCtrl.create(
      this.storeGoodsSpecsPage,
      { goods: this.goodsInfo },
      { cssClass: 'specs-modal' }
    );
    specsModal.present();
  }

}
