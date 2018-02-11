import { UserInfoPrepayPage } from './user-info-prepay/user-info-prepay';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoPage } from './user-info';
import { ComponentsModule } from '../../gouxiangke/components/components.module';
import { UserInfoAddressPage } from './user-info-address/user-info-address';
import { UserInfoCollectionPage } from './user-info-collection/user-info-collection';
import { UserInfoOrderPage } from './user-info-order/user-info-order';
import { UserInfoWalletPage } from './user-info-wallet/user-info-wallet';
import { DirectivesModule } from '../../gouxiangke/directives/directives.module';
import { UserInfoWalletRechargePage } from './user-info-wallet/user-info-wallet-recharge/user-info-wallet-recharge';
import { UserInfoWalletWithdrawalsPage } from './user-info-wallet/user-info-wallet-withdrawals/user-info-wallet-withdrawals';
import { UserInfoAddressNewPage } from './user-info-address/user-info-address-new/user-info-address-new';
import { UserInfoAddressEditorPage } from './user-info-address/user-info-address-editor/user-info-address-editor';
import { UserInfoOrderApplyservicesPage } from './user-info-order/user-info-order-applyservices/user-info-order-applyservices';
import { UserInfoOrderDetailPage } from './user-info-order/user-info-order-detail/user-info-order-detail';
import { UserInfoOrderEvaluatePage } from './user-info-order/user-info-order-evaluate/user-info-order-evaluate';
import { UserInfoOrderServicesPage } from './user-info-order/user-info-order-services/user-info-order-services';
import { UserInfoOrderSharePage } from './user-info-order/user-info-order-share/user-info-order-share';
import { UserInfoOrderConfirmPage } from './user-info-order/user-info-order-confirm/user-info-order-confirm';
import { UserInfoOrderEvasuccessPage } from './user-info-order/user-info-order-evasuccess/user-info-order-evasuccess';
import { OrderLogisticsInfoPage } from './user-info-order/order-logistics-info/order-logistics-info';
import { OrderAlertModalPage } from './user-info-order/user-info-order-modal/order-alert-modal/order-alert-modal';
import { OrderWholesalePage } from './user-info-order/order-wholesale/order-wholesale';
import { WholesaleModalUsersPage } from './user-info-order/order-wholesale/wholesale-modal-users/wholesale-modal-users';
import { UserInfoCouponPage } from './user-info-coupon/user-info-coupon';
import { UserSetPage } from "./user-set/user-set";
import { UserSetInfoPage } from './user-set/user-set-info/user-set-info';
import { UserSetInfoSubPage } from './user-set/user-set-info-sub/user-set-info-sub';
import { UserSetCertificationPage } from './user-set/user-set-certification/user-set-certification';
import { UserSetPasswordPage } from './user-set/user-set-password/user-set-password';
import { UserSetMobilePage } from './user-set/user-set-mobile/user-set-mobile';
import { UserSetPasswordLoginPage } from './../user-info/user-set/user-set-password/user-set-password-login/user-set-password-login';
import { UserSetPasswordPayPage } from './../user-info/user-set/user-set-password/user-set-password-pay/user-set-password-pay';
import { SexModalPage } from './../user-info/user-set/user-set-info-sub/sex-modal/sex-modal';
import { UserInfoEvaluatePage} from './user-info-evaluate/user-info-evaluate';

@NgModule({
  declarations: [
    UserInfoPage,
    UserInfoAddressPage,
    UserInfoCollectionPage,
    UserInfoOrderPage,
    UserInfoWalletPage,
    UserInfoWalletRechargePage,
    UserInfoWalletWithdrawalsPage,
    UserInfoAddressNewPage,
    UserInfoAddressEditorPage,
    UserInfoOrderApplyservicesPage,
    UserInfoOrderDetailPage,
    UserInfoOrderEvaluatePage,
    UserInfoOrderServicesPage,
    UserInfoOrderSharePage,
    UserInfoOrderConfirmPage,
    UserInfoOrderEvasuccessPage,
    OrderLogisticsInfoPage,
    OrderAlertModalPage,
    OrderWholesalePage,
    WholesaleModalUsersPage,
    UserInfoCouponPage,
    UserSetPage,
    UserSetInfoPage,
    UserSetInfoSubPage,
    UserSetCertificationPage,
    UserSetPasswordPage,
    UserSetMobilePage,
    UserSetPasswordLoginPage,
    UserSetPasswordPayPage,
    SexModalPage,
    UserInfoEvaluatePage,
    UserInfoPrepayPage

  ],
  imports: [
    IonicPageModule.forChild(UserInfoPage),
    ComponentsModule,
    DirectivesModule
  ],
  entryComponents: [
    UserInfoAddressPage,
    UserInfoCollectionPage,
    UserInfoOrderPage,
    UserInfoWalletPage,
    UserInfoWalletRechargePage,
    UserInfoWalletWithdrawalsPage,
    UserInfoAddressNewPage,
    UserInfoAddressEditorPage,
    UserInfoOrderApplyservicesPage,
    UserInfoOrderDetailPage,
    UserInfoOrderEvaluatePage,
    UserInfoOrderServicesPage,
    UserInfoOrderSharePage,
    UserInfoOrderConfirmPage,
    UserInfoOrderEvasuccessPage,
    OrderLogisticsInfoPage,
    OrderAlertModalPage,
    OrderWholesalePage,
    WholesaleModalUsersPage,
    UserInfoCouponPage,
    UserSetPage,
    UserSetInfoPage,
    UserSetInfoSubPage,
    UserSetCertificationPage,
    UserSetPasswordPage,
    UserSetMobilePage,
    UserSetPasswordLoginPage,
    UserSetPasswordPayPage,
    SexModalPage,
    UserInfoEvaluatePage,
    UserInfoPrepayPage
  ]
})
export class UserInfoPageModule { }