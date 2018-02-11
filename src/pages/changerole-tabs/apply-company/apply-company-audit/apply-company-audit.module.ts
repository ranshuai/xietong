import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApplyCompanyAuditPage } from './apply-company-audit';

import { DirectivesModule } from "../../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyCompanyAuditPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyCompanyAuditPage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyCompanyAuditPage,
  ]
})
export class ApplyCompanyFailPageModule { }