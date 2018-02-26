import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserSetMobilePage } from './user-set-mobile';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserSetMobilePage
  ],
  imports: [
    IonicPageModule.forChild(UserSetMobilePage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserSetMobilePageModule {}
