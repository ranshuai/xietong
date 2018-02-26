import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UserInfoEvaluatePage } from './user-info-evaluate';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoEvaluatePage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoEvaluatePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoEvaluatePageModule {}
