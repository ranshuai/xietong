import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderEvasuccessPage } from './user-info-order-evasuccess';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderEvasuccessPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderEvasuccessPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderEvasuccessPageModule {}
