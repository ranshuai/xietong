import { MainCtrl } from './../../../../providers/MainCtrl';
import { CommonModel } from './../../../../providers/CommonModel';
import { Config } from './../../providers/api/config.model';
import { ThirdPartyApiProvider } from './../../../../providers/third-party-api';
import { UserCommon } from './../../providers/user/user-common';
import { Component, ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Slides } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { StoreProvider } from "../../providers/store/store";
import { Api } from "../../providers/api/api";
import {HttpConfig} from "../../../../providers/HttpConfig";


/**
 * Generated class for the StoreDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-store-detail',
  templateUrl: 'store-detail.html',
})
export class StoreDetailPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;
  @ViewChild('StoreBg') storeBg: ElementRef;

  storeInfo: any;
  storeId: string;
  view: string = 'goods';
  isLoading=true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private common: CommonProvider,
    private store: StoreProvider,
    private api: Api,public httpConfig:HttpConfig,
    public userCommon: UserCommon,
    public thirdPartyApiProvider: ThirdPartyApiProvider,
    public config: Config,
    public commonModel: CommonModel,
    public mainCtrl:MainCtrl

  ) {
    this.storeId = this.navParams.get('store_id');
    if (this.storeId) {
      this.getStoreInfo(this.storeId);
      /**
       * 成为会员的规则
       * 进入店铺默认成为这个店铺的会员
       */
      this.userCommon.setBecomemMember({
        param: {storeId:this.storeId}
      })
    }
  }

  chat_web(){
    if (this.httpConfig.clientType == '1'&&this.httpConfig.isMsgShow) {
      this.navCtrl.push('ChatPage',{
        "toUserId": this.storeInfo.directorId,
        "toUserName": this.storeInfo.companyAlias||"",
        "headPic":  this.storeInfo.headPic||'./assets/images/public/anonymity.png'
    })
    }
  }
  getStoreInfo(storeId) {
    this.store.getStoreInfo(storeId).subscribe(data => {
      this.isLoading=false;
      if (data.success) {
        data.result = data.result ? data.result : {}
        this.storeInfo = data.result.storeIndexVO;

        //注入分享 GXK 微信分享 (独有)
        if (this.config.PLATFORM == 'WX') { 
          let link 
          link = this.mainCtrl.commonModel.APP_INIT['getAppconfig'].data.app_net_url + '?shareId=' + this.mainCtrl.commonModel.userId +'#/store/' + this.storeId;
          this.thirdPartyApiProvider.shareWx({ title:data.result.goodsName,link:link,imgUrl:this.storeInfo && this.storeInfo.headPic,desc:this.storeInfo && this.storeInfo.unitIntroduction});
        }

      }
    });
  }

  search(searchValue) {
    this.navCtrl.push('SearchPage', { searchValue: searchValue, storeId:this.storeId})
  }

  collect(status) {
    if (!this.commonModel.userId) {
      this.navCtrl.push('PublicLoginPage');
      return;
     }
    this.storeInfo.collectStatus = status;
    let data = {
      status: status,
      storeId: this.storeInfo.storeId
    };
    let msg = status ? '收藏' : '取消收藏';
    this.store.collect(data).subscribe(data => {
      if (data.success) {
        this.common.showToast(msg + '成功');
        if (status) {
          this.storeInfo.collectCounts++;
        } else {
          this.storeInfo.collectCounts--;
        }
      } else {
        this.storeInfo.collectStatus = status ? 0 : 1;
        this.common.showToast(msg + '失败');
        if (status) {
          this.storeInfo.collectCounts--;
        } else {
          this.storeInfo.collectCounts++;
        }
      }
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.storeInfo) { 
        let url =  this.storeInfo.unitBackground || '../assets/img/hotshopbg.jpg';
        this.storeBg.nativeElement.style.backgroundImage = ' url("' + url + '")';
      }
    }, 300)
  }

  goToCategory() { 
    this.common.goToPage('TabMenuPage', {index:2})
  }
}
