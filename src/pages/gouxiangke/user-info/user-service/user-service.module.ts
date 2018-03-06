import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserServicePage } from './user-service';


@NgModule({
  declarations: [
    UserServicePage,
  ],
  imports: [
    IonicPageModule.forChild(UserServicePage),
    ComponentsModule
  ],
})
export class UserServicePageModule {}
