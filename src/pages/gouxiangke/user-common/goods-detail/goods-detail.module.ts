import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GoodsDetailPage } from './goods-detail';
import { GoodsSpecsDetailPage } from "./goods-specs-detail/goods-specs-detail";

import { GoodsDetailFooterComponent } from './goods-detail-footer/goods-detail-footer';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    GoodsDetailPage,
    GoodsSpecsDetailPage,
    GoodsDetailFooterComponent,
  ],
  imports: [
    IonicPageModule.forChild(GoodsDetailPage),
    ComponentsModule,
    DirectivesModule,
  ],
  entryComponents: [
    GoodsSpecsDetailPage,
  ],
})
export class GoodsDetailPageModule { }