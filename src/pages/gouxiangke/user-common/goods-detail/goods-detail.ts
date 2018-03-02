import { MainCtrl } from './../../../../providers/MainCtrl';
import { HttpConfig } from './../../../../providers/HttpConfig';
import { Config } from './../../providers/api/config.model';
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { ThirdPartyApiProvider } from "../../../../providers/third-party-api";
import { GoodsSpecsDetailPage } from "./goods-specs-detail/goods-specs-detail";
import { GoodsProvider } from "../../providers/goods/goods";

/**
 * Generated class for the GoodsDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  segment: 'goods_detail/:goods_id',
  defaultHistory: ['UserPage']
})
@Component({
  selector: 'page-goods-detail',
  templateUrl: 'goods-detail.html'
})
export class GoodsDetailPage {

  goodsSpecsDetailPage = GoodsSpecsDetailPage;
  goodsId: string;
  goodsInfo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private modalCtrl: ModalController,
    private goods: GoodsProvider,
    private thirdPartyApi: ThirdPartyApiProvider,
    public config: Config,
    public httpConfig: HttpConfig,
    public mainCtrl: MainCtrl,
    public events:Events
  ) {
    this.goodsId = navParams.get('goods_id');
  }

  ionViewDidLoad() {
    this.init();
    //查看商品记录
    this.api.post(this.api.config.host.org + 'user/see/add/' + this.goodsId, null).subscribe();
  }

  getInfo() {
    this.api.get(this.api.config.host.bl + 'v2/goods/detail/' + this.goodsId).subscribe(data => {
      if (data.success) {
        if (data.result.goodsName) {
          this.goodsInfo = data.result;
          //配置分享信息
          if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX') { 
            this.api.getUserId().subscribe(userId => {
              let storeId = window.localStorage.storeId;
              let openId =  window.localStorage.openId;
              // let link = `${window.localStorage.host}/?openId=${openId}&shareId=${userId}&storeId=${storeId}#/goods_detail/${this.goodsId}`;
              let link 
              if (this.httpConfig.clientType == '2') {
                link = this.mainCtrl.commonModel.APP_INIT['getAppconfig'].data.app_net_url + '?shareId=' + this.mainCtrl.commonModel.userId + '&storeId=' + this.mainCtrl.httpService.config.storeId + '#/goods_detail/' + this.goodsId;
              } else { 
                link = this.mainCtrl.commonModel.APP_INIT['getAppconfig'].data.app_net_url + '?shareId=' + this.mainCtrl.commonModel.userId +'#/goods_detail/' + this.goodsId;
              }
              
              var imgUrl = this.goodsInfo.goodsImgs && this.goodsInfo.goodsImgs.length > 0 && this.goodsInfo.goodsImgs[0].imageUrl;
              this.thirdPartyApi.shareWx({ title:data.result.goodsName,link:link,imgUrl:imgUrl,desc:data.result.goodsRemark});
            });
          }
        }
      }
    });
  }

  init() {
    this.getInfo();
  }

  openSpecsModal() {
    let specsModal = this.modalCtrl.create(
      this.goodsSpecsDetailPage,
      { goods: this.goodsInfo, view: 'goodsDetail',shareId:window.sessionStorage.getItem('shareId') },
      { cssClass: 'specs-modal' }
    );
    specsModal.present();
    specsModal.onDidDismiss((data) => {
      //传递商品收藏状态
      this.goodsInfo.collectStatus = this.goods.collectStatus;
      if (data) {
        this.navCtrl.push(data.page)
       }
    });
  }
  ionViewWillLeave() { 
    window.sessionStorage.removeItem('shareId');
    //页面离开的时候触发
    this.events.publish('GetServiceModalPage:events')
  }

}
