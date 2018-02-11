import { DirectivesModule } from './../../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicSetPasswordPage } from './public-set-password';

@NgModule({
  declarations: [
    PublicSetPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicSetPasswordPage),
    DirectivesModule
  ],
})
export class PublicSetPasswordPageModule {}
