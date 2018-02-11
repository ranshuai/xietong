import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsGiftDetailPage } from './goods-gift-detail';

@NgModule({
  declarations: [
    GoodsGiftDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GoodsGiftDetailPage),
  ],
})
export class GoodsGiftDetailPageModule {}
