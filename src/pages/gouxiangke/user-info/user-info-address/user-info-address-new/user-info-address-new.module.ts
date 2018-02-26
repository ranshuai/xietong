import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoAddressNewPage } from './user-info-address-new';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoAddressNewPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoAddressNewPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoAddressNewPageModule {}
