import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderSharePage } from './user-info-order-share';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderSharePage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderSharePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderSharePageModule {}
