import { LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonData } from '../../../providers/user/commonData.model';
import { Api } from '../../../providers/api/api';
import { CommonProvider } from '../../../providers/common/common';
import { UserInfoOrderEvasuccessPage } from '../user-info-order-evasuccess/user-info-order-evasuccess';
import {ThirdPartyApiProvider } from "../../../providers/third-party-api/third-party-api";
/**
*
* Generated class for the UserInfoOrderEvaluatePage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/

@Component({
  selector: 'page-user-info-order-evaluate',
  templateUrl: 'user-info-order-evaluate.html',
})
export class UserInfoOrderEvaluatePage {
  selfApplyservicesImgIndex : number; //上传图片的下表，可以更新图片
  selfApplyservicesImgUpdate: boolean;//是否更新图片
  selfApplyservicesImgUpdate_index: number;
  orderDetail: any;
  userInfoOrderEvasuccessPage = UserInfoOrderEvasuccessPage;
  goodsIndex = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public commonData: CommonData, public api: Api, public common: CommonProvider,public thirdPartyApi:ThirdPartyApiProvider,public loadingCtrl: LoadingController) {
    //获取缓存文件中的数据
    this.initGoodsData();
  }

  initGoodsData() { 
   
    this.commonData.user_info_order.orderGoodsSimpleVOS.forEach(data=>{
        data.addTime = this.commonData.user_info_order.addTime,
        data.commentId = 0,
        data.content = '',
        data.rankCount = 5;
        data.email = "string";
        data.img = [];
        data.ipAddress = '';
        data.orderId =this.commonData.user_info_order.orderId;
        data.parentId = 0;
        data.anonymity = 0;
    })
    this.commonData.user_info_order.serviceRank = 5;//客户服务评星
    this.commonData.user_info_order.deliverRank = 5;//物流
    this.orderDetail = this.commonData.user_info_order;
  }  


  //满意度选中
  grayToRed(_index, _item, count) {
    if (_index == 1) {
      _item.rankCount = count;
    } else if (_index == 2) { 
       _item.serviceRank = count;
    }else if (_index == 3) { 
       _item.deliverRank = count;
    }
  }



  //图片选中上传

  fileChange(file) { 
    let index = this.selfApplyservicesImgIndex;
  this.thirdPartyApi.uploadImage(file.target.files[0], 'user').subscribe(data => { 
    if (data) { 
        //是否更新
      if (this.selfApplyservicesImgUpdate) {
        this.orderDetail.orderGoodsSimpleVOS[index].img[this.selfApplyservicesImgUpdate_index] = data;
      } else {
        this.orderDetail.orderGoodsSimpleVOS[index].img.push(data);
       }
      }
    })
  }
  //添加评论图片
  // addImg(goods,_index) {
  //   if (goods.img.length < 5) { 
  //     document.getElementById("commentImg").click();
  //     this.goodsIndex = _index;
  //   }
  // }
  //添加评论图片
  addImg(item, index?, b?,_index?) {
    if (b) {
      this.selfApplyservicesImgUpdate = b;
      this.selfApplyservicesImgUpdate_index = _index;
      (<HTMLInputElement>document.getElementById("commentImg")).value = null;
      document.getElementById("commentImg").click();
    } else { 
      this.selfApplyservicesImgUpdate = false;
      if (item.img.length < 5) { 
        (<HTMLInputElement>document.getElementById("commentImg")).value = null;
        document.getElementById("commentImg").click();
      }
      this.selfApplyservicesImgIndex = index;
    }
    console.log(item);
  }
  //提交评论
  submitEvalutae() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      showBackdrop:false, //是否显示遮罩层
      content: '加载中...'
    });
    loading.present();
    this.api.post(this.api.config.host.bl + 'comment/save', {
      "addTime": this.orderDetail.addTime,
      "commentId": 0,
      "deliverRank": this.orderDetail.deliverRank,   //物流
      "email": "string",
      "ipAddress": '',
      "orderId": this.orderDetail.orderId,
      "parentId": 0,
      "serviceRank": this.orderDetail.serviceRank,//客户服务质量
      "goods":this.orderDetail.orderGoodsSimpleVOS,//订单中商品信息 以及评价信息 数组形式
    }).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        this.common.goToPage(this.userInfoOrderEvasuccessPage)
      } else {
        this.common.tostMsg({msg:data.msg})
      }
    });
  }

     /**视图离开 */
  ionViewWillLeave() {
    //存储数据用于 评价成功以及圈子分享时用
    this.commonData.user_info_order=this.commonData.user_info_order; 
  }
  

}
