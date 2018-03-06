import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserCustomerServicePage } from './user-customer-service';

@NgModule({
  declarations: [
    UserCustomerServicePage,
  ],
  imports: [
    IonicPageModule.forChild(UserCustomerServicePage),
  ],
})
export class UserCustomerServicePageModule {}
