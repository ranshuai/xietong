import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNearPage } from './user-near';
import { ComponentsModule } from './../components/components.module';

@NgModule({
  declarations: [
    UserNearPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNearPage),
    ComponentsModule
  ],
})
export class UserNearPageModule {}
