import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderApplyservicesPage } from './user-info-order-applyservices';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderApplyservicesPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderApplyservicesPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderApplyservicesPageModule {}
