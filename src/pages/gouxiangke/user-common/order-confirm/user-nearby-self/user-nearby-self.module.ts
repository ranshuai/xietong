import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNearbySelfPage } from './user-nearby-self';

@NgModule({
  declarations: [
    UserNearbySelfPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNearbySelfPage),
  ],
})
export class UserNearbySelfPageModule {}
