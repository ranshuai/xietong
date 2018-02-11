import { DirectivesModule } from './../../../../directives/directives.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoGroupPage } from './user-info-group';

@NgModule({
  declarations: [
    UserInfoGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoGroupPage),
    DirectivesModule,
  ],
})
export class UserInfoGroupPageModule {}
