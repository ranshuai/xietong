import { CommonModel } from './../../../../../providers/CommonModel';
import { CommonProvider } from './../../../../gouxiangke/providers/common/common';
import { Component, Input } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { LoadingController,Events } from "ionic-angular";
import { Api } from "../../../../gouxiangke/providers/api/api";
import { StoreAddGoodsPage } from "../../store-add-goods/store-add-goods";
import { GlobalDataProvider } from "../../../../gouxiangke/providers/global-data/global-data.model";

import { Storage } from '@ionic/storage';
import {ThirdPartyApiProvider} from "../../../../gouxiangke/providers/third-party-api/third-party-api";
import { Config } from "../../../../gouxiangke/providers/api/config.model";
import {HttpConfig} from "../../../../../providers/HttpConfig";


/**
 * Generated class for the StoreGoodsDetailFooterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-goods-detail-footer',
  templateUrl: 'store-goods-detail-footer.html'
})
export class StoreGoodsDetailFooterComponent {

  storeAddGoodsPage = StoreAddGoodsPage;

  @Input() data;
  view = 1;

  constructor(
    private api: Api,
    private loadingCtrl: LoadingController,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
    public events:Events,
    public storage:Storage,
    public thirdPartyApiProvider: ThirdPartyApiProvider,
    public config: Config,
    public commonModel:CommonModel,public httpConfig:HttpConfig
  ) { 
  }


  /**
   * 客服聊天（融云）
   */
  chat() {
    console.log("点击客服按钮了！");
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX'||!this.httpConfig.isMsgShow) {
      this.common.showToast('敬请期待')
      return 
     }

    // 先判断当前用户是否登录
    let self=this;
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
                  console.log("StoreGoodsDetailFooterComponent chatid：",jsonObj.chatid);
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
        this.common.goToPage('PublicLoginPage');
      }
    });
  }

  goToShare(json?) {
    if (this.config.PLATFORM == 'APP'|| this.config.PLATFORM == 'STOREAPP') {
      let _json =
        {
          content
            :
            "分享内容",
          iconurl
            : json.originalImg,
          title
            :
            json.goodsName,
          url
            :
            json.shareUrl+"/?shareId="+this.commonModel.userId+"#/goods_detail/"+json.goodsId
        }
      this.thirdPartyApiProvider.share(_json).subscribe((data) => {
        if (data.code != -1) {
          this.common.showToast('分享成功~');
        }
      })
    }

    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') {
      let link ='http://' + window.localStorage.host+'/?shareId='+this.commonModel.userId+'#/goods_detail/'+json.goodsId;

      this.thirdPartyApiProvider.shareWx({ title: json.goodsName, link: link, imgUrl: json.originalImg, desc: json.goodsRemark })
      this.common.openChangeModal('InvestPersonTipPage', false).subscribe(data => {
        //微信分享
      });
    }
  }

  delete() {
    if (this.data.isOnSale) {
      this.common.showToast('上架商品，不可删除');
      return;
    }
    this.common.storeConfirm('确认删除?').subscribe(_ => {
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: '删除中，请稍后...'
      });
      loading.present();
      let url = 'v2/goods/v2editGoodsSort?goodsId=' + this.data.goodsId + '&isonSale=false&sort=1';
      this.api.post(this.api.config.host.bl + url).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.common.showToast('删除成功~');
        }
      });
    });
  }

  offSale() {
    let isOnSale = this.data.isOnSale;
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: (isOnSale ? '下' : '上') + '架中，请稍后...'
    });
    loading.present();
    let url = 'v2/goods/v2editGoodsSort?goodsId=' + this.data.goodsId + '&isonSale=' + !isOnSale + '&sort=1';
    this.api.post(this.api.config.host.bl + url).subscribe(data => {
      loading.dismiss();
      if (data.success) {
        this.data.isOnSale = !isOnSale;
      }
    });
  }

  edit() {
    let loading = this.loadingCtrl.create({ dismissOnPageChange: true, content: '处理中，请稍后...' });
    loading.present();
    let options = new RequestOptions({ headers: new Headers({ goodsId: this.data.goodsId, type: 1 }) });
    this.api.post(this.api.config.host.bl + 'v2/goods/toEditGoods', null, options).subscribe(data => {
      loading.dismiss();
      if (data) {
        let goods = data.result;
        if (goods.itemList.length == 1) {
          this.globalData.editStoreGoods = goods;
          this.common.goToPage(this.storeAddGoodsPage, { isEdit: true });
        } else {
          this.common.showToast('多规格商品，请用PC后台编辑~');
        }
      }
    });
  }

  //取消代售
    cancelOther(data) {
    this.common.comConfirm('取消代售').subscribe(() => { 
      console.log('取消代售');
      let goodsIds = [];
      goodsIds.push(data.goodsId)
      this.api.post(this.api.config.host.bl + 'v2/goodsList/deleteAgentGoods',goodsIds).subscribe(data => { 
        if (data.success) {
          this.common.showToast(data.msg, 500);
          this.events.publish('refresh:storeGoodsList');
          
        } else { 
          this.common.showToast(data.msg, 500)
        }
      });
    }) 
  }

}
