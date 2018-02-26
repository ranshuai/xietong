import { ComponentsModule } from './../../components/components.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UserInfoPrepayPage } from './user-info-prepay';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoPrepayPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoPrepayPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoPrepayPageModule {}
