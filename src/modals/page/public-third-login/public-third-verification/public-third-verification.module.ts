import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicThirdVerificationPage } from './public-third-verification';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    PublicThirdVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicThirdVerificationPage),
    DirectivesModule
  ],
})
export class PublicThirdVerificationPageModule {}
