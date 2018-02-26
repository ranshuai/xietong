import { DirectivesModule } from './../../../directives/directives.module';
import { OrderPayOldPage } from './order-pay-old';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    OrderPayOldPage
  ],
  imports: [
    IonicPageModule.forChild(OrderPayOldPage),
    DirectivesModule
  ],
})
export class OrderPayOldPageModule {}
