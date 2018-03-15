import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerServeDetailPage } from './customer-serve-detail';
import { DirectivesModule } from './../../directives/directives.module';


@NgModule({
  declarations: [
    CustomerServeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerServeDetailPage),
    DirectivesModule
  ],
})
export class CustomerServeDetailPageModule {}
