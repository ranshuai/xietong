import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserInfoAddressEditorPage } from './user-info-address-editor';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserInfoAddressEditorPage
  ],
  imports: [
    IonicPageModule.forChild(UserInfoAddressEditorPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserInfoAddressEditorPageModule {}
