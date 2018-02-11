import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnsUserInfoPage } from './sns-user-info';

@NgModule({
  declarations: [
      SnsUserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SnsUserInfoPage),
  ],
})
export class SnsUserInfoPageModule {}
