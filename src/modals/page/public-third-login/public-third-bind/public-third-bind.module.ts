import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicThirdBindPage } from './public-third-bind';
import { DirectivesModule } from '../../../../directives/directives.module';

@NgModule({
  declarations: [
    PublicThirdBindPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicThirdBindPage),
    DirectivesModule
  ],
})
export class PublicThirdBindPageModule {}
