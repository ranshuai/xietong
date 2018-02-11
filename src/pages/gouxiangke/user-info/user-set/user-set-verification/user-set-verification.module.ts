import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserSetVerificationPage } from './user-set-verification';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    UserSetVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(UserSetVerificationPage),
    DirectivesModule
  ],
})
export class UserSetVerificationPageModule {}
