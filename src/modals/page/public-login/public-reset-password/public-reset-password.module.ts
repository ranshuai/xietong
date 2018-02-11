import { DirectivesModule } from './../../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicResetPasswordPage } from './public-reset-password';

@NgModule({
  declarations: [
    PublicResetPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicResetPasswordPage),
    DirectivesModule
  ],
})
export class PublicResetPasswordPageModule {}
