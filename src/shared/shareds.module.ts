import { PublicShareContentShared } from './public-share-content/public-share-content';
import { PublicCommentRankShared } from './public-comment-rank/public-comment-rank';
import { PublicGoodsInfoBarShared } from './public-goods-info-bar/public-goods-info-bar';
import { PublicGoodsImgsShared } from './public-goods-imgs/public-goods-imgs';
/***公共模板文件主文件*/
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PipesModule } from "../pipes/pipes.module";
import { DirectivesModule } from "../directives/directives.module";
// import {BrainpowerSharedsModule } from "../pages/brainpower-tabs/shared/brainpower-sahreds.module"
import { GoodsStoreBarShared } from './goods-store-bar/goods-store-bar';
import { ChangeRoleBtnShared } from './change-role-btn/change-role-btn';
import { PublicGoodsDetailCommentShared } from './public-goods-detail-comment/public-goods-detail-comment';
@NgModule({
  declarations: [
    GoodsStoreBarShared,
    ChangeRoleBtnShared,
    PublicGoodsDetailCommentShared,
    PublicGoodsImgsShared,
    PublicGoodsInfoBarShared,
    PublicCommentRankShared,
    PublicShareContentShared
  ],
  imports: [
    IonicPageModule,
    DirectivesModule,
    PipesModule,
    // BrainpowerSharedsModule,
  ],
  exports: [
    GoodsStoreBarShared,
    ChangeRoleBtnShared,
    PublicGoodsDetailCommentShared,
    PublicGoodsImgsShared,
    PublicGoodsInfoBarShared,
    PublicCommentRankShared,
    PublicShareContentShared
  ]
})
export class SharedsModule { }