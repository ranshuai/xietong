import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { Api } from '../../../providers/api/api';
import { CommonData } from '../../../providers/user/commonData.model';
import { CommonProvider } from '../../../providers/common/common';
import { ThirdPartyApiProvider } from "../../../providers/third-party-api/third-party-api";
/**
 * Generated class for the UserInfoOrderSharePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order-share',
  templateUrl: 'user-info-order-share.html',
})
export class UserInfoOrderSharePage {
  orderShare: any;
    goodsIndex = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,
    public commonData: CommonData, public common: CommonProvider,public thirdPartyApi:ThirdPartyApiProvider) {
    this.initGoodsData();
  }

  initGoodsData() {
    this.commonData.user_info_order.orderGoodsSimpleVOS.forEach(data => {
      data.share = {
        content: '',
        img: []
      }
    })
    this.orderShare = this.commonData.user_info_order;

  }


  //图片选中上传

  fileChange(file) { 
    let index = this.goodsIndex;
  this.thirdPartyApi.uploadImage(file.target.files[0], 'circle').subscribe(data => { 
      if (data) { 
        this.orderShare.orderGoodsSimpleVOS[index].share.img.push(data);
      }
    })
  }
  //添加评论图片
  addImg(goods, _index) {
    if (goods.share.img.length < 5) { 
      document.getElementById("circleImg").click();
      this.goodsIndex = _index;
    }
  }

  //分享
  goToPublish(goods) {
    this.api.post(this.api.config.host.bl + 'comment/send/comment?'+'content='+goods.share.content+'&goodsId='+goods.goodsId+'&userName=""', goods.share.img).subscribe(data => {
      if (data.success) {
        //
        this.common.popToPage('UserInfoOrderPage')
        // this.navCtrl.push("UserPage", {index:"1"})
      } else {
        this.common.showToast({ msg: data.msg })
      }
    });
  }


}
