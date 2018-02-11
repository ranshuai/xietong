import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicUserSetMobilePage } from './public-user-set-mobile';
import { DirectivesModule } from './../../../directives/directives.module';

@NgModule({
  declarations: [
    PublicUserSetMobilePage,
  ],
  
  imports: [
    IonicPageModule.forChild(PublicUserSetMobilePage),
    DirectivesModule
  ],
})
export class PublicUserSetMobilePageModule {}
