import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSelectLogisticsPage } from './user-select-logistics';

@NgModule({
  declarations: [
    UserSelectLogisticsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserSelectLogisticsPage),
  ],
})
export class UserSelectLogisticsPageModule {}
