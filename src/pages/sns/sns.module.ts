import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SnsPage } from './sns';

@NgModule({
  declarations: [
    SnsPage,
  ],
  imports: [
    IonicPageModule.forChild(SnsPage),
  ],
})
export class SnsPageModule {}
