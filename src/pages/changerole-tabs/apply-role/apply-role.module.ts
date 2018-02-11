import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyRolePage } from './apply-role';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    ApplyRolePage,
  ],
  imports: [
    IonicPageModule.forChild(ApplyRolePage),
    DirectivesModule
  ],
})
export class ApplyRolePageModule {}
