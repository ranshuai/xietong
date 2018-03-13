import { DirectivesModule } from './../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserApplyCustomerServicePage } from './user-apply-customer-service';

@NgModule({
  declarations: [
    UserApplyCustomerServicePage,
  ],
  imports: [
    IonicPageModule.forChild(UserApplyCustomerServicePage),
    DirectivesModule
  ],
})
export class UserApplyCustomerServicePageModule {}
