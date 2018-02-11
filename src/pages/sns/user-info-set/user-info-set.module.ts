import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoSetPage } from './user-info-set';

@NgModule({
  declarations: [
    UserInfoSetPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoSetPage),
  ],
})
export class UserInfoSetPageModule {}
