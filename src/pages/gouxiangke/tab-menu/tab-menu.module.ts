import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabMenuPage } from './tab-menu';
/**
 *  依赖的模块
*/
import { GoodsDetailPageModule } from '../user-common/goods-detail/goods-detail.module';
import { GoodsDetailGroupPageModule } from '../user-common/goods-detail-group/goods-detail-group.module';
import { GoodsListPageModule } from '../user-common/goods-list/goods-list.module';
import { UserShoppingCartDetailPageModule } from "../user-common/user-shopping-cart-detail/user-shopping-cart-detail.module";
import { OrderConfirmPageModule } from "../user-common/order-confirm/order-confirm.module";
import { StoreDetailPageModule } from "../user-common/store-detail/store-detail.module";
import { UserInfoPageModule } from "../user-info/user-info.module"
/**
 * 自定义服务
 */ 
import { Api } from '../providers/api/api';
import { Config } from '../providers/api/config.model';
import { User } from '../providers/user/user';
import { ShoppingCart } from '../providers/user/shopping-cart';
import { CommonProvider } from '../providers/common/common';
import { GoodsProvider } from '../providers/goods/goods';
import { Validators } from '../providers/api/Validators';
import { CommonData } from '../providers/user/commonData.model';
import { IntervaConfig } from '../providers/user/intervaConfig';
import { PayProvider } from '../providers/pay/pay';
import { AddressCityData } from '../providers/user/address-cityData';
import { GlobalDataProvider } from '../providers/global-data/global-data.model';
import { OrderNowBuyProvider } from '../providers/user/order-now-buy';
import { OrderGroupBuyProvider } from '../providers/user/order-group-buy';
import { OrderAddressProvider } from "../providers/user/order-address";
import { OrderProvider } from "../providers/user/order";
import { ThirdPartyApiProvider } from '../providers/third-party-api/third-party-api';
import { OrderCouponProvider } from '../providers/user/order-coupon';
import { UserHomeTemplateProvider } from '../providers/user/user-home-template';
import { UserCommon } from './../providers/user/user-common';
import { StoreProvider } from "../providers/store/store"
import { StoreAddGoodsSpecsProvider } from './../../store-tabs/providers/store-add-goods-specs';
        

import { ComponentsModule } from "../components/components.module";
import {RongimMessageModule} from "../../../shared/rongim-message/rongim-message.module";
// import { DirectivesUserModule } from "../directives/directivesUser.module";
@NgModule({
  declarations: [
    TabMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(TabMenuPage),
    ComponentsModule,
    GoodsDetailPageModule,
    GoodsDetailGroupPageModule,
    GoodsListPageModule,
    UserShoppingCartDetailPageModule,
    OrderConfirmPageModule,
    StoreDetailPageModule,
    UserInfoPageModule,
      // RongimMessageModule

    //  DirectivesUserModule
  ],
  providers: [
    Api,
    Config,
    User,
    ShoppingCart,
    CommonProvider,
    GoodsProvider,
    Validators,
    IntervaConfig,
    CommonData,
    PayProvider,
    AddressCityData,
    GlobalDataProvider,
    OrderNowBuyProvider,
    OrderGroupBuyProvider,
    OrderAddressProvider,
    OrderProvider,
    ThirdPartyApiProvider,
    OrderCouponProvider,
    UserHomeTemplateProvider,
    UserCommon,
    StoreProvider,
    StoreAddGoodsSpecsProvider
  ]
})
export class TabMenuPageModule {}
