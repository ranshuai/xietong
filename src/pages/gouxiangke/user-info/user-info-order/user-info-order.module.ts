import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UserInfoOrderPage } from './user-info-order';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderPageModule {}
