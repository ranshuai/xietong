import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderDetailPage } from './user-info-order-detail';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderDetailPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderDetailPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoOrderDetailPageModule {}
