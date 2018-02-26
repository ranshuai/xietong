import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoWalletWithdrawalsPage } from './user-info-wallet-withdrawals';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    UserInfoWalletWithdrawalsPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoWalletWithdrawalsPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoWalletWithdrawalsPageModule {}
