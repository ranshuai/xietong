import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoOrderServicesPage } from './user-info-order-services';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoOrderServicesPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoOrderServicesPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UUserInfoOrderServicesPageModule {}
