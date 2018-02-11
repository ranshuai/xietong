import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { GlobalDataProvider } from "../../../../gouxiangke/providers/global-data/global-data.model";
import { Api } from "../../../../gouxiangke/providers/api/api";
import { CommonProvider } from "../../../../gouxiangke/providers/common/common";

/**
 * Generated class for the StoreAddGoods3Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-add-goods3',
  templateUrl: 'store-add-goods3.html',
})
export class StoreAddGoods3Page {

  isEdit = false;

  goodsRemark;
  isOnSale = 1;

  isOnSaleList: any = [{
    id: 1,
    value: '马上',
    selected: true,
  }, {
    id: 0,
    value: '暂存'
  }];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private globalData: GlobalDataProvider,
    private api: Api,
    private loadingCtrl: LoadingController,
    private common: CommonProvider,
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
    this.goodsRemark = editData.goods.goodsRemark;
  }

  submit() {
    Object.assign(this.globalData.storeGoodsForm, { goodsRemark: this.goodsRemark, });
    // isOnSale: this.isOnSaleList.find(item => item.selected).id
    let loading = this.loadingCtrl.create({ dismissOnPageChange: true, content: '提交中，请稍后...' });
    loading.present();
    if (this.isEdit) {
      Object.assign(this.globalData.storeGoodsForm, { goodsId: this.globalData.editStoreGoods.goods.goodsId });
      this.api.post(this.api.config.host.bl + 'v2/goods/editGoods', this.globalData.storeGoodsForm).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.common.showToast('编辑商品成功~');
          this.common.goToPage('StorePage', { pageIndex: 1 });
        } else {
          this.common.showToast(data.msg || '编辑失败~');
        }
      });
    } else {
      this.api.post(this.api.config.host.bl + 'v2/goods/releaseGoods', this.globalData.storeGoodsForm).subscribe(data => {
        loading.dismiss();
        if (data.success) {
          this.common.showToast('添加商品成功~');
          this.common.goToPage('StorePage', { pageIndex: 1 });
        } else {
          this.common.showToast(data.msg || '编辑失败~');
        }
      });
    }
  }

}
