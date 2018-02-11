import { DirectivesModule } from './../../../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicSetNewPasswordPage } from './public-set-new-password';

@NgModule({
  declarations: [
    PublicSetNewPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild (PublicSetNewPasswordPage),
    DirectivesModule
  ],
})
export class PublicSetNewPasswordPageModule {}
