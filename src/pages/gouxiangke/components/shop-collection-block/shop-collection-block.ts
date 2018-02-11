import { Component, Input, forwardRef, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
/**
 * Generated class for the ShopCollectionBlockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'shop-collection-block',
  templateUrl: 'shop-collection-block.html',
})  
export class ShopCollectionBlockComponent {
  @Input() data: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public common: CommonProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopCollectionBlockPage');
  }

  goTopageCompanyDetail(json) { 
    // this.common.tostMsg({ msg: '还没有店铺详情页面跳转' });
    this.common.goToPage('StoreDetailPage', { store_id:json.companyInfoId});
  }

}
