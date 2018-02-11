import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoBankPage } from './user-info-bank';

@NgModule({
  declarations: [
    UserInfoBankPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoBankPage),
  ],
  entryComponents: [
    UserInfoBankPage
  ]
})
export class UserInfoBankPageModule {}
