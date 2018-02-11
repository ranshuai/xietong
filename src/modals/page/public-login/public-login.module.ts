import { DirectivesModule } from './../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicLoginPage } from './public-login';

@NgModule({
  declarations: [
    PublicLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicLoginPage),
    DirectivesModule
  ],
})
export class PublicLoginPageModule {}
