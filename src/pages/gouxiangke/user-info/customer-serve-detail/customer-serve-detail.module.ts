import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerServeDetailPage } from './customer-serve-detail';

@NgModule({
  declarations: [
    CustomerServeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerServeDetailPage),
  ],
})
export class CustomerServeDetailPageModule {}
