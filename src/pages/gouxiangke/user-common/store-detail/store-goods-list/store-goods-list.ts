import { Component, ViewChild, Input } from '@angular/core';
import { GoodsListBlockComponent } from "../../../components/goods-list-block/goods-list-block";
import { Api } from "../../../providers/api/api";

/**
 * Generated class for the StoreGoodsListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-goods-list',
  templateUrl: 'store-goods-list.html'
})
export class StoreGoodsListComponent {

  @Input() storeId: any;
  @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;
  goodsListParams = {
    type: 'POST',
    url: this.api.config.host.bl + '/v2/goods/queryGoodsList',
    headers: {storeId:''},
    params: { storeId: '' },
    dataKey: 'data'
  };

  constructor(private api: Api) { }

  ngAfterViewInit() {
    this.goodsListParams.params.storeId = this.storeId;
    this.goodsListParams.headers.storeId = this.storeId;
    this.goodsListBlockComponent.init();
  }

}
