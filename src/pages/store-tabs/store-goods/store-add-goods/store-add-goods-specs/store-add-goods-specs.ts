import { Component, ViewChild, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { RequestOptions, Headers } from '@angular/http';
import { CommonProvider } from "../../../../gouxiangke/providers/common/common";
import { Api } from "../../../../gouxiangke/providers/api/api";
import { StoreAddGoodsSpecsProvider } from "../../../providers/store-add-goods-specs";

/**
 * Generated class for the StoreAddGoodsSpecsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-store-add-goods-specs',
  templateUrl: 'store-add-goods-specs.html',
})
export class StoreAddGoodsSpecsPage {

  @ViewChild(Content) content: Content;

  specses;
  canOver: Boolean = false;
  templetId; // 通过id =》v2/category/querySpecBytempletId 查找规格
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private api: Api,
    private common: CommonProvider,
    private storeSpecs: StoreAddGoodsSpecsProvider,
  ) {
    this.templetId = this.navParams.get('templetId');
    this.storeSpecs.get(this.templetId).subscribe(data => {
      this.specses = data;
      this.dealCanOver();
    });
  }

  closeModal() {
    this.common.closeModal();
  }

  stopProp(event) {
    this.common.stopProp(event);
  }

  choice(specItemList, item) {
    if (item.selected) {
      item.selected = false;
      this.dealCanOver();
      return;
    }
    let selectedItem = specItemList.find(item => item.selected);
    if (selectedItem) {
      selectedItem.selected = false;
    }
    item.selected = true;
    this.dealCanOver();
  }

  //处理底部下一步按钮是否可点击
  dealCanOver() {
    this.canOver = false; //只要选择一个就可以
    for (var i = 0; i < this.specses.length; i++) {
      var item = this.specses[i];
      let selected = item.specItemList.find(item => item.selected);
      if (selected) {
        this.canOver = true;
        break;
      }
    }
  }

  selected() {
    let selectedList = [];
    this.specses.forEach(specs => {
      let selectedSpecs = specs.specItemList.find(item => item.selected);
      if (selectedSpecs) {
        selectedSpecs.specName = specs.specName
        selectedList.push(selectedSpecs);
      }
    });
    this.common.closeModal(selectedList);
  }

}
