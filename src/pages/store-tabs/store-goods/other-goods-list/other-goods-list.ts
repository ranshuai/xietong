import { CommonModel } from './../../../../providers/CommonModel';
import { Api } from './../../../gouxiangke/providers/api/api';
import { CommonProvider } from './../../../gouxiangke/providers/common/common';
import { Component,ViewChild  } from '@angular/core';
import { NavController, NavParams,Events } from 'ionic-angular';
import { RequestOptions, Headers } from '@angular/http';

import { ReadyOtherGoodsPage } from "../ready-other-goods/ready-other-goods"
import { StoreGoodsListComponent } from '../store-goods-list/store-goods-list';



/**
 * Generated class for the OtherGoodsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-other-goods-list',
  templateUrl: 'other-goods-list.html',
})
export class OtherGoodsListPage {
  @ViewChild(StoreGoodsListComponent) storeGoodsList: StoreGoodsListComponent;

  sortOn: Boolean = false;
  config: any = {};
  otherGoodsList;
  readyOtherGoodsPage = ReadyOtherGoodsPage

  otherGoodsListParams = {
    url: '/v2/goodsList/queryAllAgentGoodsList',
    params: {  cateId: 0, name:'',pageNo:1},
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public common:CommonProvider,public api:Api,public commonModel:CommonModel,public events:Events) {
    this.config.oneList = [];
    this.config.twoList = [];
    this.config.threeList = [];
    let headers = new Headers({ cateId: 0}); 
    let options =new RequestOptions({ headers: headers })
    this.api.post(this.api.config.host.bl + 'v2/category/queryCategory', {}, options).subscribe(data => { 
      console.log(data);
      this.config.oneList =  data.result;
    })
    //初始化代售商品
    this.events.subscribe('otherGoodsList:refresh', () => { 
      console.log('otherGoodsList:refresh');
      this.storeGoodsList.refresh();
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtherGoodsListPage');
     /**
     * 点击排序给document 添加点击事件
    */
    let aa = document.getElementsByTagName('page-other-goods-list')[0];
    aa.addEventListener('click', ()=> { 
      this.sortOn = false;
    });
  }

  openSort() {
    this.sortOn = !this.sortOn;
  }
  //cateId改变示触发
  CateIdChange(event,n) {
    let json = {
      1: 'twoList',
      2:'threeList'
    }
    let headers = new Headers({ cateId: event}); 
    let options =new RequestOptions({ headers: headers })
    this.api.post(this.api.config.host.bl + 'v2/category/queryCategory', {}, options).subscribe(data => { 
      this.config[json[n]] = data.result;
    })
    this.getQueryAllAgentGoodsList({cateId:event})
  }

  //点击代售
  getQueryAllAgentGoodsList(json?) { 
    this.otherGoodsListParams = {
      url:'/v2/goodsList/queryAllAgentGoodsList',
      params: {  cateId: json.cateId, name:this.otherGoodsListParams.params.name,pageNo:1},
    };
  }
  readyAddOther() { 
    this.common.goToPage(this.readyOtherGoodsPage);
  }
  search(value) {
    this.otherGoodsListParams = {
      url:'/v2/goodsList/queryAllAgentGoodsList',
      params: {  cateId:this.otherGoodsListParams.params.cateId, name:value,pageNo:1},
    };
    this.storeGoodsList.search(value);
 }

}
