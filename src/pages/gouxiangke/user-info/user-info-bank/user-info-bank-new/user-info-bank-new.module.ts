import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoBankNewPage } from './user-info-bank-new';

@NgModule({
  declarations: [
    UserInfoBankNewPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoBankNewPage),
  ],
  entryComponents: [
    UserInfoBankNewPage
  ]
})
export class UserInfoBankNewPageModule {}
