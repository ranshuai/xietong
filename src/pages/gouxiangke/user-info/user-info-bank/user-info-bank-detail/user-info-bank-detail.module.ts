import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoBankDetailPage } from './user-info-bank-detail';

@NgModule({
  declarations: [
    UserInfoBankDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoBankDetailPage),
  ],
  entryComponents: [
    UserInfoBankDetailPage
  ]
})
export class UserInfoBankDetailPageModule {}
