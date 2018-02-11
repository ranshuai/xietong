import { ReadyOtherGoodsPage } from './store-goods/ready-other-goods/ready-other-goods';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorePage } from './store';

//服务
import { DataFilterConfig } from './providers/data-filter/data-filter.config';
import { DataFilterService } from './providers/data-filter/data-filter.servce';
import { StoreOrderPage } from "./store-order/store-order";
import { StoreGoodsPage } from "./store-goods/store-goods";
import { StoreClientPage } from "./store-client/store-client";
import { StoreInfoPage } from "./store-info/store-info";
import { StoreSendGoodsPage } from "./store-order/store-send-goods/store-send-goods";
import { StoreGoodsDetailPage } from "./store-goods/store-goods-detail/store-goods-detail";
import { StoreGoodsSpecsPage } from "./store-goods/store-goods-detail/store-goods-specs/store-goods-specs";
import { StoreAddGoodsPage } from "./store-goods/store-add-goods/store-add-goods";
import { StoreAddGoods2Page } from "./store-goods/store-add-goods/store-add-goods2/store-add-goods2";
import { StoreAddGoods3Page } from "./store-goods/store-add-goods/store-add-goods3/store-add-goods3";
import { StoreAddGoodsSpecsPage } from "./store-goods/store-add-goods/store-add-goods-specs/store-add-goods-specs";

import { ComponentsModule } from "../gouxiangke/components/components.module";
import { DirectivesModule } from "../gouxiangke/directives/directives.module";

import { StoreOrderListComponent } from './store-order/store-order-list/store-order-list';
import { StoreOrderBlockComponent } from './store-order/store-order-block/store-order-block';
import { StoreGoodsListComponent } from './store-goods/store-goods-list/store-goods-list';
import { StoreGoodsBlockComponent } from './store-goods/store-goods-block/store-goods-block';
import { StoreGoodsDetailFooterComponent } from './store-goods/store-goods-detail/store-goods-detail-footer/store-goods-detail-footer';

//自定义组件
import { StoreInfoInit } from "./store-info/components/store-info-init/store-info-init"
import { StroeInfoInitTwoLevelPage } from "./store-info/components/stroe-info-init-two-level/stroe-info-init-two-level";

import { StoreInfoBasePage } from "./store-info/store-info-base/store-info-base";
import { StoreInfoAptitudePage } from "./store-info/store-info-aptitude/store-info-aptitude";
import { StoreInfoAddressPage } from "./store-info/store-info-address/store-info-address";
import { StoreInfoScanPage } from "./store-info/store-info-scan/store-info-scan";
import { StoreInfoQuitPage } from "./store-info/store-info-quit/store-info-quit";
import { StoreClientBenPage } from "./store-client/store-client-ben/store-client-ben"
import {StoreOrderPricePage} from "./store-order/store-order-price/store-order-price";
import { StoreOrderCancelPage } from "./store-order/store-order-cancel/store-order-cancel";
import { OtherGoodsListPage } from './store-goods/other-goods-list/other-goods-list';

import { StoreCacheInfoProvider } from './providers/store-cache-info/store-cache-info';


@NgModule({
  declarations: [
    StorePage,
    StoreOrderPage,
    StoreGoodsPage,
    StoreClientPage,
    StoreInfoPage,
    StoreSendGoodsPage,
    StoreGoodsDetailPage,
    StoreGoodsSpecsPage,
    StoreAddGoodsPage,
    StoreAddGoods2Page,
    StoreAddGoods3Page,
    StoreAddGoodsSpecsPage,
    StoreOrderListComponent,
    StoreOrderBlockComponent,
    StoreGoodsListComponent,
    StoreGoodsBlockComponent,
    StoreGoodsDetailFooterComponent,
    StoreInfoInit,
    StroeInfoInitTwoLevelPage,
    StoreInfoBasePage,
    StoreInfoAptitudePage,
    StoreInfoAddressPage,
    StoreInfoScanPage,
    StoreInfoQuitPage,
    StoreClientBenPage,
      StoreOrderPricePage,
    StoreOrderCancelPage,
    OtherGoodsListPage,
    ReadyOtherGoodsPage
  ],
  providers: [
    DataFilterService,
    DataFilterConfig,
    StoreCacheInfoProvider
  ],
  imports: [
    IonicPageModule.forChild(StorePage),
    ComponentsModule,
    DirectivesModule,
  ],
  entryComponents: [
    StoreOrderPage,
    StoreGoodsPage,
    StoreClientPage,
    StoreInfoPage,
    StoreSendGoodsPage,
    StoreGoodsDetailPage,
    StoreGoodsSpecsPage,
    StoreAddGoodsPage,
    StoreAddGoods2Page,
    StoreAddGoods3Page,
    StoreAddGoodsSpecsPage,
    StroeInfoInitTwoLevelPage,
    StoreInfoBasePage,
    StoreInfoAptitudePage,
    StoreInfoAddressPage,
    StoreInfoScanPage,
    StoreInfoQuitPage,
    StoreClientBenPage,
    StoreOrderCancelPage,
    StoreOrderPricePage,
    OtherGoodsListPage,
    ReadyOtherGoodsPage
  ]
})
export class StorePageModule { }
