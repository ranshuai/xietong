import { NavController } from 'ionic-angular';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";
import { StoreProvider } from "../../providers/store/store";

/**
 * Generated class for the HotShopSwiperComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'hot-shop-swiper',
  templateUrl: 'hot-shop-swiper.html'
})
export class HotShopSwiperComponent {

  @Input() data: any;
  @Input() imgSpace: any;
  storeInfo: any;
  storeId: any;
  constructor(private common: CommonProvider, public mainCtrl: MainCtrl, private store: StoreProvider,public navCtrl:NavController ) {
    console.log(this.data)
    // this.data.forEach(store => {
    //   this.storeId = store.storeId || store.company_id;
    // });
   }

  enterStore(item) {
    this.navCtrl.push('StoreDetailPage', { store_id: item.company_id || item.storeId})
  }
  interceptStr(str?) {
    let _str = '';
    let leng = str.length;
    _str = leng > 34 ? str.substring(0, 34) + '...' : str;
    return _str
  }
  getStoreInfo(storeId) {
    this.store.getStoreInfo(storeId).subscribe(data => {
      if (data.success) {
        data.result = data.result ? data.result : {}
        this.storeInfo = data.result.storeIndexVO;
      }
    });
  }
  ionViewDidEnter() {
    setTimeout(() => { 
      if (this.storeInfo && this.storeInfo.unitBackground) { 
        document.getElementById('head-wrap').style.backgroundImage = ' url("' + this.storeInfo.unitBackground + '")';
      }
    }, 500)
  }
}
