import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoWalletRechargePage } from './user-info-wallet-recharge';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    UserInfoWalletRechargePage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoWalletRechargePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoWalletRechargePageModule {}
