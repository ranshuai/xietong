import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../../gouxiangke/providers/api/api";
import { GoodsListBlockComponent } from "../../../gouxiangke/components/goods-list-block/goods-list-block";
import { Storage } from '@ionic/storage';
import { LoadingController } from "ionic-angular";

/**
 * Generated class for the SearchPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @ViewChild(GoodsListBlockComponent) goodsListBlockComponent: GoodsListBlockComponent;

  searchParams = {
    url: this.api.config.host.bl + 'v2/goods/search',
    params: { likeVal: '' },
    headers: { sortType: true },
    dataKey: 'data',
  };
  _searchValue: string; //跟input绑定，随时变化
  searchValue: string;//有触发搜索时间时，接纳input的值，为了实现默写view的变化
  isDataNull: Boolean = false;//搜索结果为空
  httpComplete: Boolean = false;//http开始设为false，结束设为true
  searchHistory: Array<string> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public storage: Storage,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
  ) {
    //从参数获取value
    let searchValue = navParams.get('searchValue');
    if (window.localStorage.getItem('searchEnd') == 'true') {
      this.searchHistory = (window.localStorage.getItem('searchHistory') && window.localStorage.getItem('searchHistory').split(',')) || [];
     }
     if (searchValue) {
      this._searchValue = searchValue;
      this.search();
     }
    //  window.localStorage.setItem('searchEnd','true')
    // storage.get('searchHistory').then(data => {
    //   if (data) {
    //     this.searchHistory = data;
    //   }
    //   if (searchValue) {
    //     this._searchValue = searchValue;
    //     this.search();
    //   }
    // });
    // this.storage.set('searchEnd',true);
  }

  cancelSearch() {
    if (this._searchValue) {
       this.searchValue = this._searchValue = '';
    } else {
      this.navCtrl.pop();
    }
    window.localStorage.setItem('searchEnd','true')
    //  this.storage.set('searchEnd',true);
  }

  search() {
    if (window.localStorage.getItem('searchEnd') == 'true') {
      window.localStorage.setItem('searchEnd','false')
      let loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        showBackdrop:false, //是否显示遮罩层
        content: '加载中...'
      });
      this.searchValue = this._searchValue;
      if (!this._searchValue) {
        return;
      }
      this.httpComplete = false;
      this.searchParams.params.likeVal = this.searchValue;//搜索项是拼在链接上的
      loading.present();
      this.goodsListBlockComponent.init(); //触发搜索
      loading.dismiss();
      //保存搜索记录
      this.saveHistory(this.searchValue);
     }
  }

  saveHistory(value?) {
    if (value && this.searchHistory.indexOf(value) == -1) {
      this.searchHistory.unshift(this.searchValue);
    }
    if (this.searchHistory.length > 0) {
      window.localStorage.setItem('searchHistory', this.searchHistory.join(','))
      // this.storage.set('searchHistory', this.searchHistory);
    } else {
      window.localStorage.removeItem('searchHistory')
    }
  }

  keyup(event?) {
    if (!this._searchValue) {
      this.searchValue = this._searchValue = '';
   } else {
     // this.navCtrl.pop();
    }
    window.localStorage.setItem('searchEnd', 'true')
  }

  onComplete(isDataNull) {
    this.isDataNull = isDataNull;
    this.httpComplete = true;
  }

  selectKeyword(keyword) {
    this.searchValue = this._searchValue = keyword;
    this.search();
  }

  clearHistory() {
    let alert = this.alertCtrl.create({
      title: '确定清除历史记录吗?',
      buttons: [{
        text: '取消',
        role: '取消',
      }, {
        text: '确定',
        handler: () => {
          this.searchHistory = [];
          this.saveHistory();
        }
      }]
    });
    alert.present();
  }

}
