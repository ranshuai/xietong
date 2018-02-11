import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../../providers/api/api";
import { CommonProvider } from "../../../providers/common/common";
import { RequestOptions, Headers } from '@angular/http';

/**
 * Generated class for the GoodsGiftDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goods-gift-detail',
  templateUrl: 'goods-gift-detail.html',
})
export class GoodsGiftDetailPage {

  activityId;
  giftList;
  selfStoreId;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private common: CommonProvider,
  ) {
    this.activityId = navParams.get('activityId');
    this.selfStoreId = navParams.get('selfStoreId');

  }

  ionViewDidLoad() {
    this.getGiftDetail();
  }

  getGiftDetail() {
    let options = new RequestOptions({ headers: new Headers({ storeId : this.selfStoreId}) });
    this.api.post(this.api.config.host.bl + 'v2/gift/gift/front?activityId=' + this.activityId, {
      pageNo: 1,
      rows: 100
    },options).subscribe(data => {
      if (data.success) {
        this.giftList = data.result;
      }
    });
  }

  closeModal() {
    this.common.closeModal();
  }

  stopProp(event) {
    this.common.stopProp(event);
  }

}
