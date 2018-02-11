import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ApplyCompanyPage } from'./apply-company';

import { DirectivesModule } from "../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyCompanyPage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyCompanyPage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyCompanyPage,
  ]
})
export class ApplyCompanyPageModule { }