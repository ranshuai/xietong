import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { IonicImageViewerModule } from 'ionic-img-viewer'; //查看图片

import { DirectivesModule } from "../directives/directives.module";
import { GoodsHistoryListComponent } from "./goods-history-list/goods-history-list";
import { GoodsListBlockComponent } from "./goods-list-block/goods-list-block";
import { HotGoodsSwiperComponent } from "./hot-goods-swiper/hot-goods-swiper";
import { HotShopSwiperComponent } from "./hot-shop-swiper/hot-shop-swiper";
import { LoadMoreComponent } from "./load-more/load-more";
import { SearchButtonComponent } from "./search-button/search-button";
import { ShareButtonComponent } from "./share-button/share-button";
import { TitleMoreComponent } from "./title-more/title-more";
import { UserHomeAdComponent } from "./user-home-ad/user-home-ad";
import { UserShoppingCartComponent } from "./user-shopping-cart/user-shopping-cart";
import { GoodsImgsComponent } from "./goods-imgs/goods-imgs";
import { GoodsInfoBarComponent } from "./goods-info-bar/goods-info-bar";
import { GoodsStoreBarComponent } from './goods-store-bar/goods-store-bar';
import { CommentRankComponent } from './comment-rank/comment-rank';
import { GoodsDetailCommentComponent } from './goods-detail-comment/goods-detail-comment';
import { ShopCollectionBlockComponent } from './shop-collection-block/shop-collection-block'
import { SearchBarComponent } from './search-bar/search-bar';
import { SubNavComponent } from './sub-nav/sub-nav';
import { SearchBarFakeComponent } from './search-bar-fake/search-bar-fake';
import { GoodsSpecsSelectBarComponent } from "./goods-specs-select-bar/goods-specs-select-bar";
import { GoodsSaleInfoComponent } from './goods-sale-info/goods-sale-info';
import { InputRadioGroupComponent } from './input-radio-group/input-radio-group';
import { ChangeRolesBtnComponent } from './change-roles-btn/change-roles-btn';
import { HomeAdvertisementComponent } from './home-advertisement/home-advertisement';
import { HomePlatformComponent } from './home-platform/home-platform';
import { HomeQrcodeComponent } from './home-qrcode/home-qrcode';
import { UserHomeGroupPage } from '../user-home/user-home-group/user-home-group';
import { UserHomeHistoryPage } from '../user-home/user-home-history/user-home-history';
import { UserHomeNearbyPage } from '../user-home/user-home-nearby/user-home-nearby';
@NgModule({
  declarations: [
    GoodsHistoryListComponent,
    GoodsListBlockComponent,
    HotGoodsSwiperComponent,
    HotShopSwiperComponent,
    SearchButtonComponent,
    ShareButtonComponent,
    TitleMoreComponent,
    UserHomeAdComponent,
    LoadMoreComponent,
    UserShoppingCartComponent,
    GoodsImgsComponent,
    GoodsInfoBarComponent,
    GoodsStoreBarComponent,
    CommentRankComponent,
    GoodsDetailCommentComponent,
    ShopCollectionBlockComponent,
    SearchBarComponent,
    SubNavComponent,
    SearchBarFakeComponent,
    GoodsSpecsSelectBarComponent,
    GoodsSaleInfoComponent,
    InputRadioGroupComponent,
    ChangeRolesBtnComponent,
    HomeAdvertisementComponent,
    HomePlatformComponent,
    HomeQrcodeComponent,
    UserHomeGroupPage,
    UserHomeHistoryPage,
    UserHomeNearbyPage
  ],
  imports: [
    IonicPageModule,
    DirectivesModule,
    // IonicImageViewerModule,
  ],
  exports: [
    GoodsHistoryListComponent,
    GoodsListBlockComponent,
    HotGoodsSwiperComponent,
    HotShopSwiperComponent,
    SearchButtonComponent,
    ShareButtonComponent,
    TitleMoreComponent,
    UserHomeAdComponent,
    LoadMoreComponent,
    UserShoppingCartComponent,
    GoodsImgsComponent,
    GoodsInfoBarComponent,
    GoodsStoreBarComponent,
    CommentRankComponent,
    GoodsDetailCommentComponent,
    ShopCollectionBlockComponent,
    SearchBarComponent,
    SubNavComponent,
    SearchBarFakeComponent,
    GoodsSpecsSelectBarComponent,
    GoodsSaleInfoComponent,
    InputRadioGroupComponent,
    ChangeRolesBtnComponent,
    HomeAdvertisementComponent,
    HomePlatformComponent,
    HomeQrcodeComponent,
    UserHomeGroupPage,
    UserHomeHistoryPage,
    UserHomeNearbyPage
  ]
})
export class ComponentsModule { }
