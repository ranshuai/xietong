import { ComponentsModule } from './../../../components/components.module';
import { DirectivesModule } from './../../../directives/directives.module';
import { OrderLogisticsInfoPage } from './/order-logistics-info';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
@NgModule({
  declarations: [
    OrderLogisticsInfoPage
  ],
  imports: [
    IonicPageModule.forChild(OrderLogisticsInfoPage),
    DirectivesModule,
    ComponentsModule
  ],
})
export class OrderLogisticsInfoPageModule {}
