import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { Api } from '../../../providers/api/api';
import { RequestOptions, Headers } from '@angular/http';

/**
 * Generated class for the OrderLogisticsInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-logistics-info',
  templateUrl: 'order-logistics-info.html',
})

export class OrderLogisticsInfoPage {

  shopsearchSchDetail;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public common: CommonProvider,
    public api: Api,
    private loadingCtrl: LoadingController,
  ) {
    this.getShopsearchSchDetail();
  }

  getShopsearchSchDetail() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '获取中，请稍后...'
    });
    let options = new RequestOptions({ headers: new Headers({ orderId: this.navParams.get('orderId') }) });
    loading.present();
    this.api.get(this.api.config.host.bl + 'shop/order/searchSchDetail', {}, options).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        let detail = JSON.parse(data.result);
        this.shopsearchSchDetail = detail;
      } else {
        this.common.tostMsg({ msg: data.msg });
      }
    })
  }

  closeModal() {
    this.common.closeModal({ id: 1 });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderLogisticsInfoPage');
  }

}
