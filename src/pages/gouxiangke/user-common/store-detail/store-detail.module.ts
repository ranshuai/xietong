import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreDetailPage } from './store-detail';

import { ComponentsModule } from '../../components/components.module';
import { DirectivesModule } from '../../directives/directives.module';

import { UserTopicPageModule } from "../../user-topic//user-topic.module";

import { StoreGoodsListComponent } from './store-goods-list/store-goods-list';
import { StoreTopicListComponent } from './store-topic-list/store-topic-list';


@NgModule({
  declarations: [
    StoreDetailPage,
    StoreGoodsListComponent,
    StoreTopicListComponent,
  ],
  imports: [
    IonicPageModule.forChild(StoreDetailPage),
    ComponentsModule,
    DirectivesModule,
    UserTopicPageModule,
  ],
})
export class StoreDetailPageModule { }
