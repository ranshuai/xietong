import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UserInfoCouponPage } from './user-info-coupon';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoCouponPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoCouponPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoCouponPageModule {}
