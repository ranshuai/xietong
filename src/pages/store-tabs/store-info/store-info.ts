import { HttpConfig } from './../../../providers/HttpConfig';
import { MainCtrl } from './../../../providers/MainCtrl';
import { CommonModel } from './../../../providers/CommonModel';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../gouxiangke/providers/api/api";
import { DataFilterService } from "../providers/data-filter/data-filter.servce"
import { CommonProvider } from "../../gouxiangke/providers/common/common";
import { StoreInfoBasePage } from "./store-info-base/store-info-base";
import { StoreInfoAptitudePage } from "./store-info-aptitude/store-info-aptitude";
import { StoreInfoAddressPage } from "./store-info-address/store-info-address";
import { StoreInfoScanPage } from "./store-info-scan/store-info-scan";
import { StoreInfoQuitPage } from "./store-info-quit/store-info-quit";
import { User } from "../../gouxiangke/providers/user/user";
import { CommonData } from '../../gouxiangke/providers/user/commonData.model';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the StoreInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-info',
  templateUrl: 'store-info.html',
})
export class StoreInfoPage {

  storeInfoBasePage = StoreInfoBasePage;
  storeInfoAptitudePage = StoreInfoAptitudePage;
  storeInfoAddressPage = StoreInfoAddressPage;
  storeInfoScanPage = StoreInfoScanPage;
  storeInfoQuitPage = StoreInfoQuitPage;
  storeInfo: any = {};
  storeInfoList: any = [];

  constructor(
    public api: Api,
    public dataFilterService: DataFilterService,
    public commonProvider: CommonProvider,
    public user: User,
    public commonData: CommonData,
    public storage: Storage,
    public commonModel: CommonModel,
    public mainCtrl: MainCtrl,
    public httpConfig:HttpConfig
  ) {
  }

  ionViewDidEnter() { 
    this.getStoreData();
  }

  getStoreData() { 
//获取店铺信息 this.api.config.host.org + url
let url = "v2/check/queryModuleInfo";
this.api.post(this.api.config.host.org + url,'','','','').subscribe(data => { 
  if (data.success) {
    this.commonModel.TAB_INIT_USERINFO = Object.assign(this.commonModel.TAB_INIT_USERINFO, data.result)
    if ( data.result.status== '10006'){ 
      this.commonProvider.showToast(data.msg);
      return 
    }
    this.dataFilterService.filter('storeInfo', data).subscribe(data => { 
      this.storeInfo = data
    })
    }
})
//获取店铺相关的二级链接
this.dataFilterService.filter('storeInfoList').subscribe(data => { 
  this.storeInfoList = data;
})
  }

  goToLink(json) { 
    console.log(json);
    let _json = {
      StoreInfoBasePage: this.storeInfoBasePage,
      StoreInfoAptitudePage: this.storeInfoAptitudePage,
      StoreInfoAddressPage: this.storeInfoAddressPage,
      StoreInfoScanPage: this.storeInfoScanPage,
      StoreInfoQuitPage: this.storeInfoQuitPage
    }
    //二维码 需要companyId
    if (json.companyId) {
      if (json.quit) {
        this.commonProvider.storeConfirm('确定返回商城首页吗？').subscribe(data => {
          this.user.quitStoreLogin().subscribe(data => {
            // 1.如果是店铺APP退出登录 
            if (this.httpConfig.clientType == '2') { 
              this.commonModel.userId = null;
              let obj: any;
              this.commonModel.TAB_INIT_USERINFO = obj;
              this.mainCtrl.clearUserInfo();
            } 
            window.localStorage.setItem('storeId', '');
            this.mainCtrl.setRootPage('TabMenuPage');
            return
          })
        });
      } else { 
        this.commonProvider.goToPage(_json[json.link], { companyId: json.companyId })
      }
    }
  }
}
