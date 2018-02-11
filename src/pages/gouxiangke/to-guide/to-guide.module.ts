import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ToGuidePage } from './to-guide';

@NgModule({
  declarations: [
    ToGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(ToGuidePage),
  ],
})
export class ToGuidePageModule {}
