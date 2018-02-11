import { DirectivesModule } from './../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicWalletWithdrawalsPage } from './public-wallet-withdrawals';

@NgModule({
  declarations: [
    PublicWalletWithdrawalsPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicWalletWithdrawalsPage),
    DirectivesModule
  ],
})
export class PublicWalletWithdrawalsPageModule {}
