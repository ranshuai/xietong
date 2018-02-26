import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoPage } from './user-info';
import { ComponentsModule } from '../../gouxiangke/components/components.module';
// import { UserInfoAddressPage } from './user-info-address/user-info-address';
import { DirectivesModule } from '../../gouxiangke/directives/directives.module';
import { OrderAlertModalPage } from './user-info-order/user-info-order-modal/order-alert-modal/order-alert-modal';
import { OrderWholesalePage } from './user-info-order/order-wholesale/order-wholesale';
import { WholesaleModalUsersPage } from './user-info-order/order-wholesale/wholesale-modal-users/wholesale-modal-users';
import { UserSetPasswordPage } from './user-set/user-set-password/user-set-password';
import { UserSetPasswordLoginPage } from './../user-info/user-set/user-set-password/user-set-password-login/user-set-password-login';
import { SexModalPage } from './../user-info/user-set/user-set-info-sub/sex-modal/sex-modal';

@NgModule({
  declarations: [
    UserInfoPage,
    // UserInfoAddressPage,
    OrderAlertModalPage,
    OrderWholesalePage,
    WholesaleModalUsersPage,
    UserSetPasswordPage,
    UserSetPasswordLoginPage,
    SexModalPage,

  ],
  imports: [
    IonicPageModule.forChild(UserInfoPage),
    ComponentsModule,
    DirectivesModule
  ],
  entryComponents: [
    // UserInfoAddressPage,
    OrderAlertModalPage,
    OrderWholesalePage,
    WholesaleModalUsersPage,
    UserSetPasswordPage,
    UserSetPasswordLoginPage,
    SexModalPage,
  ]
})
export class UserInfoPageModule { }