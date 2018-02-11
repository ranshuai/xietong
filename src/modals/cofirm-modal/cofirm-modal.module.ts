import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {  CofirmModal} from './cofirm-modal';

@NgModule({
  declarations: [
    CofirmModal,
  ],
  imports: [
    IonicPageModule.forChild(CofirmModal),
  ],
  exports: [
    CofirmModal
  ]
})
export class CofirmModalModule {}
