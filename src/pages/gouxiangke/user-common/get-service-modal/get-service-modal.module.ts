import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetServiceModalPage } from './get-service-modal';

@NgModule({
  declarations: [
    GetServiceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GetServiceModalPage),
  ],
})
export class GetServiceModalPageModule {}
