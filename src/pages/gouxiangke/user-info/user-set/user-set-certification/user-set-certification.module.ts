import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { UserSetCertificationPage } from './user-set-certification';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    UserSetCertificationPage
  ],
  imports: [
    IonicPageModule.forChild(UserSetCertificationPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class UserSetCertificationPageModule {}
