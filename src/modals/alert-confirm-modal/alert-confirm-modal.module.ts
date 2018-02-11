import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlertConfirmModalPage } from './alert-confirm-modal';

@NgModule({
  declarations: [
    AlertConfirmModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AlertConfirmModalPage),
  ],
})
export class AlertConfirmModalPageModule {}
