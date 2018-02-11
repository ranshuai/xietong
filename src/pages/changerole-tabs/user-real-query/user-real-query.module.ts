import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRealQueryPage } from './user-real-query';
import { DirectivesModule } from '../../../directives/directives.module';

@NgModule({
  declarations: [
    UserRealQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRealQueryPage),
    DirectivesModule
  ],
})
export class UserRealQueryPageModule {}
