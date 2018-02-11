import { CommonModel } from './../../../../providers/CommonModel';

import { CommonProvider } from './../../../gouxiangke/providers/common/common';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StoreCacheInfoProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StoreCacheInfoProvider {

  public cacheOtherGoodsList = [];
  public listLength: number; // 代售商品数量
  public checkBoxAll: boolean = true; //是否全选

  constructor(public http: Http,public commonProvider:CommonProvider,public commonModel:CommonModel) {
    console.log('Hello StoreCacheInfoProvider Provider');
  }
  //添加 只能添加一个
  addCacheOtherGoodsList(item?) {
    //数组中是否有合格item
    function returnBoolean(arr, item) {
      let b = true;
      for (var i = 0; i < arr.length; i++) { 
        if (arr[i].goodsId == item.goodsId) {
          b = false;
         }
      }
      return b
    }
    //如果缓存列表中有这个对象就不添加;
    this.listLength = this.cacheOtherGoodsList.length;
    if (!this.listLength) {
      this.cacheOtherGoodsList.push(item);
      this.commonModel.cacheOtherGoodsListLength = this.cacheOtherGoodsList.length; 
    } else {
      if (returnBoolean(this.cacheOtherGoodsList, item)) { 
        this.cacheOtherGoodsList.push(item);
      }
      this.commonModel.cacheOtherGoodsListLength = this.cacheOtherGoodsList.length; 
    }
    this.commonProvider.tostMsg({ msg: '添加成功' })
  }
  // 获取缓存里买的代售商品
  getCacheOtherGoodsList() { 
    return this.cacheOtherGoodsList;
  }
  //删除 可以删除多个 
  removeCacheOtherGoodsList(arr?) { 
    for (var i = 0; i < this.cacheOtherGoodsList.length; i++) {
      if (this.cacheOtherGoodsList[i].ac == true) { 
        this.cacheOtherGoodsList.splice(i, 1)
        i--;
      }
    }
    this.commonModel.cacheOtherGoodsListLength = this.cacheOtherGoodsList.length;
    console.log(this.commonModel.cacheOtherGoodsListLength)
  }
  //更新 checkbox 
  updateCacheOtherGoodsList(item?) { 
    this.listLength = this.cacheOtherGoodsList.length;

    if (typeof item == 'boolean') {
      for (var i = 0; i < this.listLength; i++) {
          this.cacheOtherGoodsList[i].ac = item;
      }
      this.getCheckBoxAll();
      return 
    }
    for (var i = 0; i < this.listLength; i++) {
      if (this.cacheOtherGoodsList[i].goodsId == item.goodsId) {
        this.cacheOtherGoodsList[i].ac = item.ac;
        break;
      }
    }
    this.getCheckBoxAll();
  }

  //全选的状态
  getCheckBoxAll() { 
    this.listLength = this.cacheOtherGoodsList.length;
    let b:boolean = true;
    for (var i = 0; i < this.listLength; i++) {
      if (this.cacheOtherGoodsList[i].ac != true) {
        b = false;
        break;
      } 
    }

    this.checkBoxAll = b;
  }

}
