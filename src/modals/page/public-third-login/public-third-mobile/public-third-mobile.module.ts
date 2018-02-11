import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicThirdMobilePage } from './public-third-mobile';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    PublicThirdMobilePage,
  ],
  imports: [
    IonicPageModule.forChild(PublicThirdMobilePage),
    DirectivesModule
  ],
})
export class PublicThirdMobilePageModule {}
