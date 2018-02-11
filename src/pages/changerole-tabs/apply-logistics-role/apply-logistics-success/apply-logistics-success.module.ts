import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApplyLogisticsSuccessPage } from './apply-logistics-success';

import { DirectivesModule } from "../../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyLogisticsSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyLogisticsSuccessPage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyLogisticsSuccessPage,
  ]
})
export class ApplyLogisticsSuccessPageModule { }