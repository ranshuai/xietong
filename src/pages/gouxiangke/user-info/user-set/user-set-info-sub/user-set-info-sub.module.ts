import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserSetInfoSubPage } from './user-set-info-sub';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserSetInfoSubPage
  ],
  imports: [
    IonicPageModule.forChild(UserSetInfoSubPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserSetInfoSubPagePageModule {}
