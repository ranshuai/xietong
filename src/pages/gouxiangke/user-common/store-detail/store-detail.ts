import { CommonModel } from './../../../../providers/CommonModel';
import { Config } from './../../providers/api/config.model';
import { ThirdPartyApiProvider } from './../../providers/third-party-api/third-party-api';
import { UserCommon } from './../../providers/user/user-common';
import { Component, ViewChild } from '@angular/core';
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
@IonicPage({
  segment: 'store/:store_id',
  defaultHistory: ['UserPage']
})
@Component({
  selector: 'page-store-detail',
  templateUrl: 'store-detail.html',
})
export class StoreDetailPage {

  @ViewChild(Content) content: Content;
  @ViewChild(Slides) slides: Slides;

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
    public commonModel:CommonModel
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
    if(this.httpConfig.clientType == '1'){
      this.common.goToPage('ChatPage',{
          "toUserId": this.storeInfo.directorId,
          "toUserName": this.storeInfo.companyAlias||"",
          "headPic":  this.storeInfo.headPic||'./assets/images/public/anonymity.png'
      });
    }
  }
  getStoreInfo(storeId) {
    this.store.getStoreInfo(storeId).subscribe(data => {
      this.isLoading=false;
      if (data.success) {
        data.result = data.result ? data.result : {}
        this.storeInfo = data.result.storeIndexVO;

        //注入分享 GXK 微信分享 (独有)
        if (this.config.PLATFORMTYPE = 'WX') { 
          let link ='http://' + window.localStorage.host+'/?shareId='+this.commonModel.userId+'#/store/'+this.storeId ;
          this.thirdPartyApiProvider.shareWx({ title:this.storeInfo && this.storeInfo.companyName,link:link,imgUrl:this.storeInfo && this.storeInfo.headPic,desc:this.storeInfo && this.storeInfo.unitIntroduction})
        }
      }
    });
  }

  search(searchValue) {
    this.common.goToPage('SearchPage', { searchValue: searchValue, storeId:this.storeId});
  }

  collect(status) {
    if (!this.commonModel.userId) {
      this.common.goToPage('PublicLoginPage');
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
      if (this.storeInfo && this.storeInfo.unitBackground) { 
        document.getElementById('store-info').style.backgroundImage = ' url("' + this.storeInfo.unitBackground + '")';
      }
    }, 500)
  }

  goToCategory() { 
    this.common.goToPage('TabMenuPage', {index:2})
  }
}
