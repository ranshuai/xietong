import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApplyCompanyFailPage } from './apply-company-fail';

import { DirectivesModule } from "../../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyCompanyFailPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyCompanyFailPage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyCompanyFailPage,
  ]
})
export class ApplyCompanyFailPageModule { }