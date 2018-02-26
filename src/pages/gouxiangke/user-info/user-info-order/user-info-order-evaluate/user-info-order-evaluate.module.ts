import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderEvaluatePage } from './user-info-order-evaluate';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderEvaluatePage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderEvaluatePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderEvaluatePageModule {}
