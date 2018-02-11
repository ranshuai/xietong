import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmCompanyPage } from './confirm-company';

@NgModule({
  declarations: [
    ConfirmCompanyPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmCompanyPage),
  ],
})
export class ConfirmCompanyPageModule {}
