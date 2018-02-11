
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GoodsDetailGroupPage } from './goods-detail-group';
import { GoodsSpecsDetailGroupPage } from "./goods-detail-group-specs/goods-detail-group-specs";
import { GoodsDetailGroupFooterComponent } from './goods-detail-group-footer/goods-detail-group-footer';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
  GoodsDetailGroupPage,
  GoodsDetailGroupFooterComponent,
  GoodsSpecsDetailGroupPage
  ],
  imports: [
  IonicPageModule,
  ComponentsModule,
  DirectivesModule,
  ],
  entryComponents: [
  GoodsDetailGroupPage,
  GoodsSpecsDetailGroupPage
  ],
})
export class GoodsDetailGroupPageModule { }