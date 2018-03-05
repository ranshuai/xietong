import { ShoppingCart } from './../../../providers/user/shopping-cart';
import { CommonModel } from './../../../../../providers/CommonModel';
import { UserCommon } from '../../../providers/user/user-common';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Slides,ModalController,IonicPage,Events,LoadingController } from 'ionic-angular';
import { CommonProvider } from '../../../providers/common/common';
import { CommonData } from '../../../providers/user/commonData.model';
import { Api } from '../../../providers/api/api';
import { OrderProvider } from "../../../providers/user/order";
import {UserInfoOrderConfirmPage } from '../user-info-order-confirm/user-info-order-confirm';
import { OrderAlertModalPage } from './../user-info-order-modal/order-alert-modal/order-alert-modal';
import { OrderWholesalePage } from './../order-wholesale/order-wholesale';
import {ThirdPartyApiProvider} from "../../../providers/third-party-api/third-party-api";
import {Config} from "../../../providers/api/config.model";
import { Storage } from '@ionic/storage';
import { RequestOptions, Headers } from '@angular/http';
import {HttpConfig} from "../../../../../providers/HttpConfig";

/**
 * Generated class for the UserInfoOrderDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order-detail',
  templateUrl: 'user-info-order-detail.html',
})
export class UserInfoOrderDetailPage {
  userInfoOrderApplyservicesPage = 'UserInfoOrderApplyservicesPage'; //申请售后
  userInfoOrderEvaluatePage = 'UserInfoOrderEvaluatePage'; // 评价
  userInfoOrderServicesPage = 'UserInfoOrderServicesPage';//售后
  userInfoOrderSharePage = 'UserInfoOrderSharePage';//圈子
  userInfoOrderConfirmPage = 'UserInfoOrderConfirmPage';//订单确认
  orderAlertModalPage = OrderAlertModalPage;//
  orderWholesalePage = OrderWholesalePage;//
  orderLogisticsInfoPage = 'OrderLogisticsInfoPage';// 物流订单
  orderDetailModelData: any;
  relateGoodsList: any;
  alertData: any;
  orderId;
  @ViewChild(Slides) slides: Slides;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public commonData: CommonData, public api: Api, private alertCtrl: AlertController, public common: CommonProvider,
    private order: OrderProvider,public storage:Storage,public httpConfig:HttpConfig,
              public thirdPartyApiProvider: ThirdPartyApiProvider,
              public config: Config,public userCommon:UserCommon,public modalCtrl:ModalController,public events:Events,public commonModel:CommonModel,public loadingCtrl:LoadingController,public shoppingCart:ShoppingCart
  ) {
    this.orderId = navParams.get('orderId')

  }
  /**
   * 客服聊天（融云）
   */
  chat(data) {
    console.log("点击客服按钮了！");
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX'||!this.httpConfig.isMsgShow) {
      this.common.showToast('敬请期待');
      return 
    }
    // 先判断当前用户是否登录
    this.storage.get('userId').then(userId => {
      if (userId) {
        // 获取融云token
        let url="https://t.b.snsall.com/rong/cloud/token";
        let param={space:this.config.domain,userId:userId};
        console.log("商品详情页获取到domain域：",this.config.domain);

        this.api.get(url,param).subscribe(res=>{
          console.log("获取融云token：",JSON.stringify(res));
          if(res.success){
            if(res.result){
              let token=res.result.token;
              let name=res.result.name;
              let picurl=res.result.picurl;
              let obj = '{"token":"'+token+'","name":"'+name+'","picurl": "'+picurl+'"}';
              //  登录融云
              this.thirdPartyApiProvider.IMLogin(obj).subscribe(res=>{
                console.log("融云登录结果：",JSON.stringify(res));
                if(res){
                  //  开启聊天界面
                  let jsonObj=JSON.parse(obj);
                  jsonObj.chatid= data.store.directorId;
                  console.log("UserInfoOrderDetailPage chatid：",jsonObj.chatid);
                  if(data.store.name){
                    jsonObj.title="与"+data.store.name+"客服对话中";
                  }else{
                    jsonObj.title="";
                  }
                  jsonObj.userId=res.userId;
                  obj=JSON.stringify(jsonObj);
                  this.thirdPartyApiProvider.chat(obj);
                }
              });
            }
          }
        });
      }
      else {
        this.navCtrl.push('PublicLoginPage');
      }
    });
  }

   /**
   * 客服聊天
  */
 servicePopup(storeId) {
    //禁止用户多次触发
    if (this.commonModel.canActive) {
      this.commonModel.canActive = false;
      this.userCommon.getServiceList(storeId).subscribe(data => { 
        let serviceModal = this.modalCtrl.create(
          'GetServiceModalPage',
          { data: data },
          { cssClass: 'service-modal'}
        );
        serviceModal.present();
        this.commonModel.canActive = true;
      })
    } 
  }

  //获取订单详情
  getOrderDetail() {
    this.order.getOrderDetail(this.orderId || this.commonData.user_info_order.orderId).subscribe(data => {
      if (data.success) {
        
        this.orderDetailModelData = data.result;
        this.relateGoods(this.orderDetailModelData.storeId);
        this.getActivetyOrder();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }
  //订单详情活动部分信息
  getActivetyOrder() {
    this.api.get( this.api.config.host.bl+'/v2/activity/order/detail', {
    orderId:this.orderDetailModelData.orderId
    }).subscribe(data => {
      if (data.success) {
        this.orderDetailModelData.activety = data.result;

      } else {
       this.common.tostMsg({ msg: data.msg })
      }
    })
  }

  //获取相关商品
  relateGoods(storeId) {
    //店铺Id
    let headers = new Headers({ storeId : storeId }); 
    let options =new RequestOptions({ headers: headers })
    this.api.get(this.api.config.host.bl + 'v2/goods/queryStoreGoodsList',{
      "pageNo": 1,//页码
      "rows": 5//一页显示条数
    },options).subscribe(data => {
      if (data.success) {
        this.relateGoodsList = data.result;
        console.log(this.relateGoodsList)
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }
  //取消订单 共有2种状态
  cancelOrderPop(_item) {
    //商家已接单 ==0是未接单
    if (_item.orderStatus != 0) {
      this.common.openChangeModal(this.orderAlertModalPage, false, { state: 1 }).subscribe();
    } else {
     this.commonData.user_info_order = _item;
      this.common.openChangeModal(this.orderAlertModalPage, false, { state: 3 }).subscribe(data => {
        //提示返回账户钱
        if (data) {
          if ((data as any).success) {
            this.common.tostMsg({ msg: (data as any).msg })
            this.navCtrl.pop();
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }

      });
    }
  }

    //删除订单
  deleteOrderPop(_item) {
  this.common.openChangeModal(this.orderAlertModalPage, false, { state: 5 }).subscribe(data => {
         if (data) {
          if ((data as any).success) {
           this.common.tostMsg({ msg: (data as any).msg })
           this.navCtrl.pop();
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }
    });
  }
  /**跳转有关订单的二级页面 */
  goToPage(_url, _item) {
    // this.commonData.user_info_order = _item;
    let url;
    let all;
    if (_url == '分享圈子') {
      url = this.userInfoOrderSharePage;
    } else if (_url == '申请售后') {
      url = this.userInfoOrderApplyservicesPage;
    } else if (_url == '售后') {
      url = this.userInfoOrderServicesPage;
    } else if (_url == '评价') {
      url = this.userInfoOrderEvaluatePage;
    }else if (_url == '订单确认') {
        all=false;
      url = this.userInfoOrderConfirmPage;
    }else if (_url == '召集小伙伴') {
      url = this.orderWholesalePage;
    }
    this.navCtrl.push(url,{all:all})
  }
  //确认收货
  confirm_receiptPopup(_item) {
    this.order.confirm_receiptPopup(_item).subscribe(data => {
      if (data.success) {
        this.common.tostMsg({ msg: data.msg })
        this.getOrderDetail();
        this.navCtrl.pop();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    });
  }

  ionViewDidEnter() {
    this.getOrderDetail();
  }


  //查看物流
  openChangeModal(item) {
    this.common.openChangeModal(this.orderLogisticsInfoPage, false, { orderId: item.orderId }).subscribe();
  }
    //再来一单
    copayOrder(item) {
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: '提交中，请稍后...'
      });
      loading.present();
      this.api.get(this.api.config.host.bl + '/shop/one/more/' + item.orderId, {}).subscribe(data => {
        loading.dismiss()
        if (data.success) {
           setTimeout(() => {
          this.common.tostMsg({ msg: data.msg ||'连接异常'})
           }, 800)
           this.navCtrl.push('UserShoppingCartDetailPage', {shoppCartFlag:true});
          this.shoppingCart.getShoppingCartInfo().subscribe();
          this.events.publish('shoppingCart:refresh')
        }
  
      })
  
    }

  ionViewWillLeave() {
    //页面离开的时候触发
    this.events.publish('GetServiceModalPage:events')
  }


}
