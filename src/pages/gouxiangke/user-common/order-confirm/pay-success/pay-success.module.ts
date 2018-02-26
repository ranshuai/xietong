import { DirectivesModule } from './../../../directives/directives.module';
import { PaySuccessPage } from './pay-success';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PaySuccessPage
  ],
  imports: [
    IonicPageModule.forChild(PaySuccessPage),
  ],
})
export class PaySuccessPageModule {}
