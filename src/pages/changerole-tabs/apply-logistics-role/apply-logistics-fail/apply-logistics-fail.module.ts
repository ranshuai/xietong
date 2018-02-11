import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApplyLogisticsFailPage } from './apply-logistics-fail';


import { DirectivesModule } from "../../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyLogisticsFailPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyLogisticsFailPage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyLogisticsFailPage,
  ]
})
export class ApplyLogisticsFailPageModule { }