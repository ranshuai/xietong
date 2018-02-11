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
  @Output() selectGiftEmit = new EventEmitter();

  constructor(private common: CommonProvider) { }

  goToDetailPage(goodsId) {
    this.common.goToPage('GoodsDetailPage', { goods_id: goodsId });
  }

  selectGift(goods,giftOption) {
    this.selectGiftEmit.emit({goods,giftOption});
  }

}
