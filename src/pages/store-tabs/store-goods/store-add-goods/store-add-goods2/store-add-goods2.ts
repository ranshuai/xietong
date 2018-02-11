import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ThirdPartyApiProvider } from "../../../../gouxiangke/providers/third-party-api/third-party-api";
import { CommonProvider } from "../../../../gouxiangke/providers/common/common";
import { GlobalDataProvider } from "../../../../gouxiangke/providers/global-data/global-data.model";
import { StoreAddGoods3Page } from "../store-add-goods3/store-add-goods3";

/**
 * Generated class for the StoreAddGoods2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-add-goods2',
  templateUrl: 'store-add-goods2.html',
})
export class StoreAddGoods2Page {

  storeAddGoods3Page = StoreAddGoods3Page;

  isEdit = false;

  uploadIndex: 0;
  imgs = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private thirdPartyApi: ThirdPartyApiProvider,
    private common: CommonProvider,
    private globalData: GlobalDataProvider,
  ) {
    this.isEdit = this.navParams.get('isEdit');
  }

  ionViewDidLoad() {
    if (this.isEdit) {
      this.initEditData();
    }
  }

  initEditData() {
    let editData = this.globalData.editStoreGoods;
    let imgList = editData.imgList;
    imgList.forEach(item => {
      this.imgs.push(item.imageUrl);
    });
  }

  upload(index) {
    (<HTMLInputElement>document.getElementById("file")).value = null;
    document.getElementById('file').click();
    this.uploadIndex = index;
  }

  fileChange(event) {
    this.thirdPartyApi.uploadImage(event.target.files[0], 'goods').subscribe(data => {
      this.imgs[this.uploadIndex] = data;
    });
  }

  next() {
    /**
     * 第一张是主图，不放到imgsUrlList里面， 主图放到 originalImg里面
     */

    let _img = this.imgs[0];
    this.imgs.splice(0, 1)
    Object.assign(this.globalData.storeGoodsForm, { imgsUrlList: this.imgs, originalImg: _img });
    this.common.goToPage(this.storeAddGoods3Page, { isEdit: this.isEdit });
  }

  ionViewDidEnter(){
    this.imgs = (this.globalData.storeGoodsForm.imgsUrlList || []);
    if (this.globalData.storeGoodsForm.originalImg) {
      this.imgs.unshift(this.globalData.storeGoodsForm.originalImg)
      
     }
  }



}
