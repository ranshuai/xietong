import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserSetInfoPage } from './user-set-info';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserSetInfoPage
  ],
  imports: [
    IonicPageModule.forChild(UserSetInfoPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserSetInfoPageModule {}
