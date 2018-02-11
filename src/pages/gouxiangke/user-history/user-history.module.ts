import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserHistoryPage } from './user-history';
import { ComponentsModule } from './../components/components.module';

@NgModule({
  declarations: [
    UserHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(UserHistoryPage),
    ComponentsModule
  ],
})
export class UserHistoryPageModule {}
