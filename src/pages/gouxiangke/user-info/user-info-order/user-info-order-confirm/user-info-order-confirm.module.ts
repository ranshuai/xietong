import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderConfirmPage } from './user-info-order-confirm';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderConfirmPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderConfirmPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderConfirmPageModule {}
