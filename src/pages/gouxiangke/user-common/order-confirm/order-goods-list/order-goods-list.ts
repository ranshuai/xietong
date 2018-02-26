import { NavController } from 'ionic-angular';
import { GlobalDataProvider } from './../../../providers/global-data/global-data.model';
import { Api } from './../../../providers/api/api';
import { CommonModel } from './../../../../../providers/CommonModel';
import { Events } from 'ionic-angular';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonProvider } from "../../../providers/common/common";
/**
 * Generated class for the OrderGoodsListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'order-goods-list',
  templateUrl: 'order-goods-list.html'
})
export class OrderGoodsListComponent {

  @Input() data;
  dataLength; // data的长度
  @Output() selectGiftEmit = new EventEmitter();
  selfIndex = null; // 选择配送方式 下标 
  selfkey = null;// 选择配送方式 key {}
  //默认的配送方式
  constructor(private common: CommonProvider,public navCtrl:NavController, public events:Events, public commonModel:CommonModel, public api:Api, private globalData: GlobalDataProvider,) { 
   
    // //选择地址运费重新计算
    // this.events.subscribe('selectAddress:OrderGoodsListComponent', () => { 
    //   this.test();
    // })

  }

  goToDetailPage(goodsId) {
    this.navCtrl.push( 'GoodsDetailPage', { goods_id: goodsId })
  }

  selectGift(goods,giftOption) {
    this.selectGiftEmit.emit({goods,giftOption});
  }

  //选择发货方式
  goToSelectLogistics(store, _i) {
    this.commonModel.freightOrderGoods = 0;
    
    if (!this.commonModel.userDefaultAndSetAddres.province) { 
      this.common.showToast('选择地址');
      return 
    }
    (this.commonModel.pageOrderConfirm as any).selfIndex = _i;
    (this.commonModel.pageOrderConfirm as any).selfkey = store.storeId;
    
    this.navCtrl.push('UserSelectLogisticsPage', {store:store})
  }
  //获取运费
  


}
