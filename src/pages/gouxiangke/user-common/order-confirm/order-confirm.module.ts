import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { OrderConfirmPage } from "./order-confirm";
// import { OrderPayPage } from './order-pay/order-pay';
// import { PaySuccessPage } from "./pay-success/pay-success";
import { OrderCouponPage } from "./order-coupon/order-coupon";

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { SelectAddressBarComponent } from './select-address-bar/select-address-bar';
import { OrderGoodsListComponent } from './order-goods-list/order-goods-list';

@NgModule({
  declarations: [
    OrderConfirmPage,
    // OrderPayPage,
    // PaySuccessPage,
    OrderCouponPage,
    SelectAddressBarComponent,
    OrderGoodsListComponent,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmPage),
    ComponentsModule,
    DirectivesModule,
  ],
  entryComponents: [
    // OrderPayPage,
    // PaySuccessPage,
    OrderCouponPage,
  ]
})
export class OrderConfirmPageModule { }