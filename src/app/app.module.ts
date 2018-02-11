import {NgModule, ErrorHandler} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicModule, Config} from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";
import { MyApp } from "./app.component";
//页面
import { SpringboardPageModule } from "../pages/springboard/springboard.module";
import { Code404PageModule} from "../pages/wechat/code404/code404.module"

//每个卡牌的页面组件
// import { LogisticsSharedModule } from "../pages/logistics/shared/logistics-shared.module";
// import { ResultsPageModule} from "../pages/logistics/results/results.module";
// import { ReceiveOrderPageModule} from "../pages/logistics/receive-order/receive-order.module";


/******************** 消费者 店铺 ********************************/
import { TabMenuPageModule } from './../pages/gouxiangke/tab-menu/tab-menu.module';
import { StorePageModule } from "../pages/store-tabs/store.module"
/******************** 消费者 店铺 ********************************/


import { PipesModule } from "../pipes/pipes.module";
import { DirectivesModule } from "../directives/directives.module";
import { SharedsModule } from "../shared/shareds.module";




import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AppVersion} from "@ionic-native/app-version";
import {Camera} from "@ionic-native/camera";
import {Toast} from "@ionic-native/toast";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {CallNumber} from "@ionic-native/call-number";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import {Diagnostic} from "@ionic-native/diagnostic";
import { Device } from '@ionic-native/device';
import { FileOpener } from '@ionic-native/file-opener';
import { DatePicker } from '@ionic-native/date-picker';




import { NativeService } from "../providers/NativeService";
import { ThirdPartyApiProvider} from "../providers/third-party-api"
import { HttpService } from "../providers/HttpService";
import { HttpConfig} from "../providers/HttpConfig"
import {MainCtrl} from "../providers/MainCtrl";
import {Utils} from "../providers/Utils";
import {HttpModule} from "@angular/http";
import {CommonModel} from "../providers/CommonModel";
import {FUNDEBUG_API_KEY} from "../providers/Constants";
import {Logger} from "../providers/Logger";
import { ModalFromRightEnter, ModalFromRightLeave, ModalScaleEnter, ModalScaleLeave } from "./modal-transitions";
import { AddressCityData} from "../providers/address-city-data";
import { DataFiltersService} from "../providers/DataFiltersServce";
import { DataFiltersConfig} from "../providers/DataFiltersConfig";
//参考文档:https://docs.fundebug.com/notifier/javascript/framework/ionic2.html
import * as fundebug from "fundebug-javascript";
import {Contacts} from "@ionic-native/contacts";
import {RongimMessageModule} from "../shared/rongim-message/rongim-message.module";
// import {IonicImageViewerModule} from "ionic-img-viewer";
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
export class FunDebugErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    fundebug.notifyError(err);
    console.error(err);
  }
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',//android是'md'
      backButtonText: '',
        tabsHideOnSubPages:true//隐藏子菜单 by mwh
    }),
    IonicStorageModule.forRoot(),
    SpringboardPageModule,
    Code404PageModule,
    // LogisticsSharedModule,
    // ResultsPageModule,
    // ReceiveOrderPageModule,
    PipesModule,
    DirectivesModule,
    SharedsModule,
    TabMenuPageModule,
    StorePageModule,
      RongimMessageModule,
      ionicGalleryModal.GalleryModalModule

      // IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    AppVersion,
    Camera,
    Toast,
    File,
    FileTransfer,
    InAppBrowser,
    ImagePicker,
    Network,
    AppMinimize,
    Diagnostic,
    CallNumber,
      Contacts,
    BarcodeScanner,
    Device,
    FileOpener,
    {provide: ErrorHandler, useClass: FunDebugErrorHandler},
    NativeService,
    ThirdPartyApiProvider,
    HttpService,
    HttpConfig,
    MainCtrl,
    Utils,
    CommonModel,
    Logger,
    AddressCityData,
    DatePicker,
    DataFiltersService,
    DataFiltersConfig,
      {
          provide: HAMMER_GESTURE_CONFIG,
          useClass: ionicGalleryModal.GalleryModalHammerConfig
      }

  ]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }
}
