import { CommonModel } from './../../../../providers/CommonModel';
import { ThirdPartyApiProvider } from './../../../gouxiangke/providers/third-party-api/third-party-api';
import { Config } from './../../../gouxiangke/providers/api/config.model';
import { CommonData } from './../../../gouxiangke/providers/user/commonData.model';
import { UserInfoOrderDetailPage } from './../user-info-order/user-info-order-detail/user-info-order-detail';
import { CommonProvider } from './../../../gouxiangke/providers/common/common';
import { Api } from './../../../gouxiangke/providers/api/api';
import { UserCommon } from './../../../gouxiangke/providers/user/user-common';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { OrderWholesalePage } from '../user-info-order/order-wholesale/order-wholesale';

/**
 * Generated class for the UserInfoGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-info-group',
  templateUrl: 'user-info-group.html',
})
export class UserInfoGroupPage {
  activeType = 0;
  groupOrderList;
  orderWholesalePage = OrderWholesalePage;
  userInfoOrderDetailPage = UserInfoOrderDetailPage;
  json = {
    page: 1,
    rows: 10,
    loadEnd:false
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public userCommon: UserCommon, public modalCtrl: ModalController, public api: Api, public commonProvider: CommonProvider,public commonData:CommonData,public config:Config,public thirdPartyApiProvider:ThirdPartyApiProvider,public commonModel:CommonModel) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserInfoGroupPage');
    this.getGroupOrderList();
  }

  getGroupOrderList(doInfinite?) { 
    this.api.get(this.api.config.host.bl +'promison/list/my/'+this.activeType, {
      page:  this.json.page,
      rows: this.json.rows,
    }).subscribe(data => { 
      if (data.success) {
        data.result = data.result ? data.result : []; 
        if (this.json.page == 1) {
          this.groupOrderList = data.result;
        } else {
          this.groupOrderList = [...this.groupOrderList, ...data.result];
        }
        
        let leng = data.result.length;
        if (leng < this.json.rows) {
          this.json.loadEnd = true;
        } else {
          this.json.loadEnd = false;
          this.json.page++;
        }
        doInfinite && doInfinite.complete();
      } else { 
        this.commonProvider.tostMsg({msg:data.msg});
      }
    })


  }

  refresh(refresh) { 
    this.getGroupOrderList(refresh);
  }

  doInfinite(refresh) { 
    this.getGroupOrderList(refresh);
  }

  //导航切换
  changeNav(_type) {
    if (_type != this.activeType) {
      this.activeType = _type;
      this.json.page = 1;
      this.getGroupOrderList();
    }
  }
  goToGroupDetail(item,orderId) { 
    // this.commonProvider.goToPage('UserInfoGroupDetailPage');
    this.commonProvider.goToPage(this.orderWholesalePage, {orderId:orderId,groupInfo:item});


  }
  goToOrderDetail(item, orderId) { 
    this.commonProvider.goToPage(this.userInfoOrderDetailPage, {'orderId':orderId});
  }

  /**
   *  联系客服
   */

  servicePopup(storeId) {
    this.userCommon.getServiceList(storeId).subscribe(data => { 
      let serviceModal = this.modalCtrl.create(
        'GetServiceModalPage',
        { data: data },
        { cssClass: 'service-modal'}
      );
      serviceModal.present();
    })
  }

  goToPage() { 
    
  }

   //点击分享商品
   clickShare(item) {
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'STOREAPP') {
      let  json = {
        title: item.goodsName,
        content: item.goodsRemark,
        iconurl: item.originalImg, 
        url:item.shareUrl+'?shareId='+this.commonModel.userId+'#/group_detail/'+item.goodsId 
      }
      this.thirdPartyApiProvider.share(json).subscribe((data) => { 
        if (data.code != -1) { 
          this.commonProvider.showToast('分享成功~');
        }
      })
     }
  }

}
