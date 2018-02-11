import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyLogisticsRolePage } from'./apply-logistics-role';
import { DirectivesModule } from "../../../directives/directives.module";



@NgModule({
  declarations: [
    ApplyLogisticsRolePage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyLogisticsRolePage),
    IonicPageModule,
    DirectivesModule,
  ],
  entryComponents: [
    ApplyLogisticsRolePage,
  ]
})
export class ApplyLogisticsRolePageModule { }