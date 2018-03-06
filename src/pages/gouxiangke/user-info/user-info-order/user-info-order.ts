import { ShoppingCart } from './../../providers/user/shopping-cart';
import { CommonModel } from './../../../../providers/CommonModel';
import { MainCtrl } from './../../../../providers/MainCtrl';
import { UserCommon } from './../../providers/user/user-common';
import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, IonicPage, Content, AlertController,App,ModalController,Events } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CommonProvider } from '../../providers/common/common';
import { CommonData } from '../../providers/user/commonData.model';
import { LoadingController } from "ionic-angular";
import { OrderAlertModalPage } from './user-info-order-modal/order-alert-modal/order-alert-modal';
import { OrderWholesalePage } from './order-wholesale/order-wholesale';
import {ThirdPartyApiProvider} from "../../providers/third-party-api/third-party-api";
import {Config} from "../../providers/api/config.model";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UserInfoOrderPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-info-order',
  templateUrl: 'user-info-order.html',
})
export class UserInfoOrderPage {
  userInfoOrderApplyservicesPage = 'UserInfoOrderApplyservicesPage'; // 申请售后
  userInfoOrderDetailPage = 'UserInfoOrderDetailPage';//详情
  userInfoOrderEvaluatePage = 'UserInfoOrderEvaluatePage';// 评价
  userInfoOrderServicesPage = 'UserInfoOrderServicesPage';//售后
  userInfoOrderSharePage = 'UserInfoOrderSharePage';// 圈子
  userInfoOrderConfirmPage = 'UserInfoOrderConfirmPage';// 订单确认
  orderLogisticsInfoPage = 'OrderLogisticsInfoPage';//物流订单
  orderAlertModalPage = OrderAlertModalPage;//
  orderWholesalePage = OrderWholesalePage;//
  @ViewChild(Content) content: Content;
  //默认选中
  activeType = 'all';
  //是否启用上拉
  isSrooll = false;
  //订单列表
  orderList = {
    'all': {
      page: 1,
      rows: 10,
      loadEnd: false,
      clist: undefined,
      scrollTop: 0
    },
    'obligation': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    },
    'toSendGoods': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    },
    'waitReceived': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    },
    'evaluated': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    },
    'after_sale': {
      page: 1,
      rows: 10,
      loadEnd: false,
      scrollTop: 0
    }
  };
  //弹框 用于浏览器放回小时
  alertData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,
              public common: CommonProvider, private alertCtrl: AlertController,
              public commondata: CommonData,public storage:Storage,
              public thirdPartyApiProvider: ThirdPartyApiProvider,
    public config: Config, public userCommon: UserCommon, public modalCtrl: ModalController,
    public mainCtrl: MainCtrl,public events:Events,public commonModel:CommonModel,public loadingCtrl:LoadingController,public shoppingCart:ShoppingCart
              

    ) {
    this.activeType = this.navParams.get('type');
    this.common.orderList = this.navCtrl.getViews().length;

  }

  /**
   * 客服聊天（融云）
   */
  chat(data) {
    console.log("点击客服按钮了！");
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
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
                  jsonObj.chatid=data.directorId;
                  console.log("UserInfoOrderPage chatid：",jsonObj.chatid);
                  if(data.storeName){
                    jsonObj.title="与"+data.storeName+"客服对话中";
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
        this.navCtrl.push('PublicLoginPage')        
      }
    });
  }
   /**
   *  联系客服
   */

  servicePopup(storeId) {
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

  //订单查询
  getOrderQuery(refresher?) {

    let type = this.activeType;
    if (this.orderList[type].loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.bl + 'v2/order/query' , {
      type:type,
      page: this.orderList[type].page,
      rows: this.orderList[type].rows,
    }).subscribe(data => {
      if (data.success) {
        if (data.result.length >= this.orderList[type].rows) {
          this.orderList[type].loadEnd = false;
        } else {
          this.orderList[type].loadEnd = true;
        }
        if (this.orderList[type].page == 1) {
          this.orderList[type].clist = undefined;
          this.orderList[type].clist = data.result;
        } else {
          this.orderList[type].clist = this.orderList[type].clist.concat(data.result);
        }
        this.orderList[type].page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
    })
  }


  /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.getOrderQuery(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.orderList[this.activeType].page = 1;
    this.orderList[this.activeType].loadEnd = false;
    this.getOrderQuery(refresher);
  }

  //导航切换
  changeNav(_type) {
    //记录滚动距离
    (this.orderList[this.activeType] as any).scrollTop = this.content.getContentDimensions().scrollTop;
    if (_type != this.activeType) {
      this.activeType = _type;
      if (!(this.orderList[_type] as any).clist) {
        setTimeout(() => {
          this.scrollToTop(this.orderList[_type].scrollTop);
          this.getOrderQuery();
        }, 50);
      } else {
        this.scrollToTop(this.orderList[_type].scrollTop);
      }
    }
  }
  //滚动到指定位置
  scrollToTop(_number) {
    this.isSrooll = true;
    setTimeout(data => {
    this.content.scrollTo(0, _number,0);
    this.isSrooll = false;
    }, 50);
  }


  //取消订单 共有2种状态
  cancelOrderPop(_item) {
    //商家已接单 ==0是未接单
    if (_item.orderStatus != 0) {
      this.common.openChangeModal(this.orderAlertModalPage, false, { state: 1 }).subscribe();
    } else {
     this.commondata.user_info_order = _item;
      this.common.openChangeModal(this.orderAlertModalPage, false, { state: 3 }).subscribe(data => {
        //提示返回账户钱
        if (data) {
          if ((data as any).success) {
            this.initAlertData();
             this.common.tostMsg({ msg: (data as any).msg })
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }

      });
    }
  }

 //确认收货
  confirm_receiptPopup(_item) {
     this.commondata.user_info_order = _item;
    this.common.openChangeModal(this.orderAlertModalPage, false, { state: 4 }).subscribe(data => {
         if (data) {
          if ((data as any).success) {
           this.common.tostMsg({ msg: (data as any).msg })
          this.initAlertData();
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }
    });
  }


  //删除订单
  deleteOrderPop(_item) {
    this.commondata.user_info_order = _item;
  this.common.openChangeModal(this.orderAlertModalPage, false, { state: 5 }).subscribe(data => {
         if (data) {
          if ((data as any).success) {
           this.common.tostMsg({ msg: (data as any).msg })
          this.initAlertData();
          } else {
            this.common.tostMsg({ msg: (data as any).msg })
          }
        }
    });
  }

  //当前页面数据重新初始化
  initAlertData() {
    let type = this.activeType;
    this.orderList[type].page = 1;
    this.orderList[type].loadEnd = false;
    this.orderList[type].isSrooll = 0;
    this.scrollToTop(this.orderList[type].isSrooll);
    this.getOrderQuery();
  }

  /**跳转有关订单的二级页面 */
  goToPage(_url, _item) {
    this.commondata.user_info_order = _item;
    let all;
    let url;
    if (_url == '分享圈子') {
      url = this.userInfoOrderSharePage;
    } else if (_url == '申请售后') {
      url = this.userInfoOrderApplyservicesPage;
    } else if (_url == '售后') {
      url = this.userInfoOrderServicesPage;
    } else if (_url == '评价') {
      url = this.userInfoOrderEvaluatePage;
    } else if (_url == '详情') {
      url = this.userInfoOrderDetailPage;
    } else if (_url == '订单确认') {
      all=false;
      url = this.userInfoOrderConfirmPage;
    } else if (_url == '召集小伙伴') {
      url = this.orderWholesalePage;
    }
    this.navCtrl.push(url,{all:all})
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
        if (data.success){
          this.navCtrl.push('UserShoppingCartDetailPage', { shoppCartFlag: true });
  
          this.shoppingCart.getShoppingCartInfo().subscribe();
          this.events.publish('shoppingCart:refresh')
          
        }
        setTimeout(() => {
          this.common.tostMsg({ msg: data.msg ||'连接异常'})
        },800)
      })
  
     }
  
  //申请售后
  gotoCustomerService(item) {
    console.log(item);
    //点击申请售后跳转到分商品的页面
    this.navCtrl.push('UserServicePage',{orderInfo:item});
    

    // this.navCtrl.push('UserCustomerServicePage', {orderData:item});
    
  }


    //页面初始化
  ionViewDidEnter() {
    
      this.initAlertData()
    }

  /**视图离开 */
  ionViewWillLeave() {
    //视图离开如果弹框还在就消失
    if (this.alertData) {
      this.alertData.dismiss();
    }
     //页面离开的时候触发
     this.events.publish('GetServiceModalPage:events')
  }

}
