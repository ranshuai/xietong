import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";
/**
 * Generated class for the GoodsSaleInfoComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-sale-info',
  templateUrl: 'goods-sale-info.html'
})
export class GoodsSaleInfoComponent {

  @Input() data: any;

  @Input() selfStoreId: any;

  constructor(
    public common: CommonProvider,
    public navCtrl:NavController
  ) {

  }

  openGiftDetail(item) {
    if (item.activityType == 1) {
      this.common.goToPage('GoodsListPage', { activityId: item.activityId,selfStoreId:this.selfStoreId }, { activityId: item.activityId });
    } else if (item.activityType == 2) {
      this.common.openChangeModal('GoodsGiftDetailPage', null, { activityId: item.activityId ,selfStoreId:this.selfStoreId }).subscribe();
    }
  }

}
