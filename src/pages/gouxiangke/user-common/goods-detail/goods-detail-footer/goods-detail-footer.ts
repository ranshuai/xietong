import { MainCtrl } from './../../../../../providers/MainCtrl';
import { CommonModel } from './../../../../../providers/CommonModel';
import { UserCommon } from './../../../providers/user/user-common';
import { CommonData } from './../../../providers/user/commonData.model';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ViewController, ModalController, NavController} from 'ionic-angular';
import { Api } from "../../../providers/api/api";
import { CommonProvider } from "../../../providers/common/common";
import { GoodsProvider } from "../../../providers/goods/goods";
import { Storage } from '@ionic/storage';
import {ThirdPartyApiProvider} from "../../../providers/third-party-api/third-party-api";
import { Config } from "../../../providers/api/config.model";
import {HttpService} from "../../../../../providers/HttpService";
import {HttpConfig} from "../../../../../providers/HttpConfig";
import { NativeService } from "../../../../../providers/NativeService";
/**
 * Generated class for the GoodsDetailFooterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-detail-footer',
  templateUrl: 'goods-detail-footer.html',
})
export class GoodsDetailFooterComponent {

  @Input() data;
  @Input() isModal: string; //判断界面是商品详情，还是规格
  @Output() openSpecsModalEmit = new EventEmitter();
  @Output() addCartEmit = new EventEmitter();
  @Output() nowBuyEmit = new EventEmitter();
  userSetMobilePage = 'UserSetMobilePage';

  constructor(
    private api: Api,
    public common: CommonProvider,
    private goods: GoodsProvider,
    private viewCtrl: ViewController,
    public storage:Storage,
    public thirdPartyApiProvider: ThirdPartyApiProvider,
    public commonData:CommonData,
    public config: Config,
    public userCommon: UserCommon,
    public modalCtrl: ModalController,
    public commonModel:CommonModel,
    public navCtrl:NavController,
    public httpService: HttpService, public httpConfig: HttpConfig, public nativeService: NativeService,
    public mainCtrl:MainCtrl
  ) { }

  ngAfterContentInit() {
    this.goods.collectStatus = this.data.collectStatus; //将collectStatus更新
  }

    /**
     * 融云聊天 -web
     */
    chat_web(){
      //判断是否登录
        if (!this.commonModel.userId) {
            //如果没有userID跳转登陆页面
            this.navCtrl.push('PublicLoginPage');
        } else {
            //获取店主信息
            this.queryUserInfo();
        }

    }

    queryUserInfo() {
        let reqData={
            uid:this.data.ownerPerson
        };
        if(this.data.ownerPerson==this.commonModel._userId){
            reqData=null;
        }
        this.httpService.get(this.httpConfig.host.org+"sns/user/getUserInfo",reqData)
        /*this.httpService.get(this.httpConfig.host.org+"sns/user/getUserInfo",null,{
            userId:this.toUserId
        })*/
            .subscribe((data) => {
                if (data.success) {
                    //传递商品信息
                    let extra={
                        productInfo:{
                          goodsName:this.data.goodsName,
                          goods_id:this.data.goodsId,
                          marketPrice:this.data.marketPrice,
                          originalImg:this.data.originalImg
                      }
                      ,from:"productDetail"
                    };
                  this.navCtrl.push('ChatPage',{
                    "extra":extra,
                      "toUserId": this.data.ownerPerson,
                      "toUserName": data.result.nickname||"",
                      "headPic":  data.result.headPic||'./assets/images/public/anonymity.png'
                  })
                }else{
                  // this.nativeService.showToast("")
                }
            });
    }

  /**
   * 客服聊天（融云）
   */
  chat() {
    console.log("点击客服按钮了！");

    if (this.config.PLATFORM == 'APP') {
      let self=this;
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
                      jsonObj.chatid=self.data.ownerPerson;
                      console.log("GoodsDetailFooterComponent chatid：",jsonObj.chatid);
                      if(self.data.ownerPersonName){
                        jsonObj.title="与"+self.data.ownerPersonName+"客服对话中";
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
    
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      this.common.showToast('敬请期待')
     }
    
  }

  goToHomePage() {
    if (this.isModal == 'true') {
      this.viewCtrl.dismiss(null, null, { animate: false });
      this.mainCtrl.setRootPage('TabMenuPage');
    } else {
      this.mainCtrl.setRootPage('TabMenuPage');
    }
  }

  //收藏
  collect() {
    
    //没有登录去登录
    if (!this.commonModel.userId) {
      if (this.viewCtrl.isOverlay) {
        this.viewCtrl.dismiss({page:'PublicLoginPage'})
        return 
       }
      this.navCtrl.push('PublicLoginPage');
      return;
     }
    let dealCallBack = (success, status) => {
      if (success) {//如果改变成功，
        this.goods.collectStatus = status;
        console.log(status);
        this.common.tostMsg({msg:status?'收藏成功':'取消收藏成功'})
      } else {//否则，将状态回置
        this.data.collectStatus = !this.data.collectStatus;
      }
    };

    this.data.collectStatus = this.data.collectStatus ? false : true;
    if (this.data.collectStatus) {
      this.goods.addCollect(this.data.goodsId).subscribe(data => {
        dealCallBack(data.success, true);
      });
    } else {
      this.goods.delCollect(this.data.goodsId).subscribe(data => {
        dealCallBack(data.success, false);
      });
    }
  }

  openModal() {
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage,{type:1})
        })
      }else{
        this.openSpecsModalEmit.emit();
      }
      return 
    }
    if (this.config.PLATFORM == 'APP'|| this.config.PLATFORM == 'STOREAPP') { 
      this.openSpecsModalEmit.emit();
      return 
    }
  }

  addCart() {
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage,{type:1})
        })
      }else{
        this.addCartEmit.emit();
      }
      return 
    }
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'STOREAPP') { 
      this.addCartEmit.emit();
      return 
    }
  }

  nowBuy() {
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
      if(!this.commonModel.TAB_INIT_USERINFO.mobile){
        this.common.count = true;
        this.common.openMobileModal().subscribe(() => {
          this.navCtrl.push(this.userSetMobilePage,{type:1})
        })
      }else{
        this.nowBuyEmit.emit();
      }
      return 
    }
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'STOREAPP') { 
      this.nowBuyEmit.emit();
      return 
    }
  }
  servicePopup(storeId) {
      //域商城才聊天，店铺显示号码
      if(this.httpConfig.clientType=='1'){
          this.chat_web();
      } else {
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
  }
}
