import { CommonModel } from './../../../../../providers/CommonModel';
import { Config } from './../../../providers/api/config.model';
import { ThirdPartyApiProvider } from './../../../providers/third-party-api/third-party-api';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { CommonData } from '../../../providers/user/commonData.model';
import { UserInfoOrderDetailPage } from '../../user-info-order/user-info-order-detail/user-info-order-detail';
import { WholesaleModalUsersPage } from './wholesale-modal-users/wholesale-modal-users';
import { GoodsDetailGroupPage } from "../../../user-common/goods-detail-group/goods-detail-group";

/**
 * Generated class for the OrderWholesalePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-wholesale',
  templateUrl: 'order-wholesale.html',
})
export class OrderWholesalePage {
  userInfoOrderDetailPage = UserInfoOrderDetailPage;
  wholesaleModalUsersPage = WholesaleModalUsersPage;
  goodsDetailGroupPage = GoodsDetailGroupPage
  wholesale: any;

  orderId;//我的拼团进入
  groupInfo;//我的拼团进入
  userGroupInfo; //页面数据

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public common: CommonProvider, public commonData: CommonData, public thirdPartyApiProvider: ThirdPartyApiProvider, public config: Config,public commonModel:CommonModel) {
    this.orderId = navParams.get('orderId');
    this.groupInfo = navParams.get('groupInfo');
    if (this.groupInfo) {
      console.log(this.groupInfo)
      this.api.get(this.api.config.host.bl + 'promison/detail/' + this.groupInfo.gid).subscribe(data => {
        if (data.success) {
          data.result = data.result || {};
          this.userGroupInfo = data.result;
          for (var i = data.result.headPicList.length; i < data.result.num; i++) {
            data.result.headPicList.push("../../../../../assets/img/groupnocomplete.png");
          }
          this.groupsBuyGoods(this.userGroupInfo);

        }
      })
    } else { 
      this.groupUser();
    }
  }
  //获取拼团成员信息
  groupUser() {
    this.api.get(this.api.config.host.bl + 'group/' + (this.orderId || this.commonData.user_info_order.orderId )+ '/groupUsers').subscribe(data => {
      if (data.success) {
        let _data: any = {};
        this.commonData.user_info_order.wholesaleUser =JSON.stringify(data.result);
        if (data.result.length == this.commonData.user_info_order.orderGoodsSimpleVOS[0].qtyGroupOrder) {
          _data.groupUser = data.result;
          _data.groupUser.isEnd = true;

        } else {
          for (var i = data.result.length; i < this.commonData.user_info_order.orderGoodsSimpleVOS[0].qtyGroupOrder; i++) {
            data.result.push({
              "userImg": "../../../../../assets/img/groupnocomplete.png"
            });
          }
          _data.groupUser = data.result;
          _data.groupUser.isEnd = false;
        }
        this.groupsBuyGoods(_data);
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }
  //获取更多拼团相关商品
  groupsBuyGoods(item) {
    this.api.get(this.api.config.host.bl + 'goods/list/groupsBuyPage', {
      page: 1,
      rows: 10
    }).subscribe(data => {
      if (data.success) {
        item.groupsBuyGoods = data.result;
        if (!this.userGroupInfo) { 
          this.queryShare(item)
        }
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }

  queryShare(_item) {
    this.api.get(this.api.config.host.org + 'user/query/share', {
      goodsId: this.commonData.user_info_order.orderGoodsSimpleVOS[0].goodsId,
      groupId: this.commonData.user_info_order.orderGoodsSimpleVOS[0].promId
    }).subscribe(data => {
      if (data.success) {
        _item.share = data.result;
        _item.orderGoodsSimpleVOS = this.commonData.user_info_order.orderGoodsSimpleVOS[0];
        this.wholesale = _item;
        console.log(this.wholesale);
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }

  //查看成员列表
  queryUser() { 
    console.log( this.commonData.user_info_order.wholesaleUser)
    this.common.openChangeModal(this.wholesaleModalUsersPage, false, {
    }).subscribe(data => { 

    })
  }

  //点击召集小伙伴
  clickShare() {
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'STOREAPP') {
      let json;
      if (this.groupInfo) {
        json = {
          title: this.userGroupInfo.goodsName,
          content: this.userGroupInfo.goodsRemark,
          iconurl: this.userGroupInfo.originalImg, 
          url:this.userGroupInfo.shareUrl+'?shareId='+this.commonModel.userId+'#/group_detail/'+this.userGroupInfo.goodsId 
        }
      } else {
        json = {
          title: this.wholesale.share.goodsName,
          content: this.wholesale.share.goodsRemark,
          iconurl: this.wholesale.share.iconurl, 
          url:this.wholesale.share.url+'?shareId='+this.wholesale.share.userId+'&storeId='+this.wholesale.share.storeId+'#/group_detail/'+this.wholesale.orderGoodsSimpleVOS.goodsId 
        }
       }
     
      this.thirdPartyApiProvider.share(json).subscribe((data) => { 
        if (data.code != -1) { 
          this.common.showToast('分享成功~');
        }
      })
     }
  }

  //跳转订单详情
  goTopage() { 
    this.common.goToPage(this.userInfoOrderDetailPage);
  }

  goToGoodsDetail(item) { 
    let goodsId = item.goods_id || item.goodsId ||item.id;
    this.common.goToPage(this.goodsDetailGroupPage, { goods_id: goodsId });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderWholesalePage');
  }





}
