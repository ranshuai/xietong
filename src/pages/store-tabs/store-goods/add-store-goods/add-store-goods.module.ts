import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddStoreGoodsPage } from './add-store-goods';

@NgModule({
  declarations: [
    AddStoreGoodsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddStoreGoodsPage),
  ],
})
export class AddStoreGoodsPageModule {}
