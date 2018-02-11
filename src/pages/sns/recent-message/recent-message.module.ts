import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecentMessagePage } from './recent-message';

@NgModule({
  declarations: [
    RecentMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(RecentMessagePage),
  ],
})
export class RecentMessagePageModule {}
