import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";

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

  constructor(private common: CommonProvider,public mainCtrl:MainCtrl) { }

  enterStore(item) {
    this.common.goToPage('StoreDetailPage', { store_id: item.company_id || item.storeId});
  }
  interceptStr(str?) {
    let _str = '';
    let leng = str.length;
    _str = leng > 34 ? str.substring(0, 34) + '...' : str;
    return _str
  }
}
