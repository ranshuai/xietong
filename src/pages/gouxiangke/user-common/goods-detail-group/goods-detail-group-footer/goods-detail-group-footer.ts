import { MainCtrl } from './../../../../../providers/MainCtrl';
import { CommonModel } from './../../../../../providers/CommonModel';
import { UserCommon } from './../../../providers/user/user-common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewController ,Events,ModalController,NavController} from 'ionic-angular';
import { Api } from "../../../providers/api/api";
import { CommonProvider } from "../../../providers/common/common";
import { GoodsProvider } from "../../../providers/goods/goods";
import { Storage } from '@ionic/storage';
import {ThirdPartyApiProvider} from "../../../providers/third-party-api/third-party-api";
import { Config } from "../../../providers/api/config.model";
/**
 * Generated class for the GoodsDetailFooterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-detail-group-footer',
  templateUrl: 'goods-detail-group-footer.html',
})
export class GoodsDetailGroupFooterComponent {

  @Input() data;
  @Input() isModal: string; //判断界面是商品详情，还是规格
  @Output() openSpecsModalEmit = new EventEmitter();
  @Output() addCartEmit = new EventEmitter();
  @Output() nowBuyEmit = new EventEmitter();

  constructor(
    private api: Api,
    public common: CommonProvider,
    private goods: GoodsProvider,
    private viewCtrl: ViewController,
    public storage:Storage,
    public thirdPartyApiProvider: ThirdPartyApiProvider,
    public config: Config,
    public events: Events,
    public userCommon: UserCommon,
    public modalCtrl: ModalController,
    public mainCtrl: MainCtrl,
    public navCtrl:NavController,
    public commonModel:CommonModel
  ) { }

  ngAfterContentInit() {
    this.goods.collectStatus = this.data.collectStatus; //将collectStatus更新
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
    let dealCallBack = (success, status) => {
      if (success) {//如果改变成功，
        this.goods.collectStatus = status;
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


  /**
   * 客服聊天（融云）
   */
  chat() {
    console.log("点击客服按钮了！");
    if (this.config.PLATFORM == 'APP') {
      let self = this;
      // 先判断当前用户是否登录
      this.storage.get('userId').then(userId => {
        if (userId) {
          // 获取融云token
          let url = "https://t.b.snsall.com/rong/cloud/token";
          let param = { space: this.config.domain, userId: userId };
          console.log("商品详情页获取到domain域：", this.config.domain);
  
          this.api.get(url, param).subscribe(res => {
            console.log("获取融云token：", JSON.stringify(res));
            if (res.success) {
              if (res.result) {
                let token = res.result.token;
                let name = res.result.name;
                let picurl = res.result.picurl;
                let obj = '{"token":"' + token + '","name":"' + name + '","picurl": "' + picurl + '"}';
                //  登录融云
                this.thirdPartyApiProvider.IMLogin(obj).subscribe(res => {
                  console.log("融云登录结果：", JSON.stringify(res));
                  if (res) {
                    //  开启聊天界面
                    let jsonObj = JSON.parse(obj);
                    jsonObj.chatid = self.data.ownerperson;
                    console.log("GoodsDetailGroupFooterComponent chatid：", jsonObj.chatid);
                    if (self.data.ownerPersonName) {
                      jsonObj.title = "与" + self.data.ownerPersonName + "客服对话中";
                    } else {
                      jsonObj.title = "";
                    }
                    jsonObj.userId = res.userId;
                    obj = JSON.stringify(jsonObj);
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
    if (this.config.PLATFORM == "WX") {
      this.common.showToast('敬请期待');
     }
  }

  toView(){
    //事件广播
    this.events.publish('goodsGroup:contentTop')
  }

  addCart() {
    this.addCartEmit.emit();
  }

  nowBuy() {
    this.nowBuyEmit.emit();
  }

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

}
