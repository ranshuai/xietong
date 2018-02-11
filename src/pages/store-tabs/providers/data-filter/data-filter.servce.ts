import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { DataFilterConfig }from "./data-filter.config"
/**
 * 数据的过滤
 * 
 */
@Injectable()
export class DataFilterService {
  setInit = {};
  constructor( public dataFilterConfig:DataFilterConfig) { }
  // 入口
  filter(key: string, json?: any) { 
    console.log(key);
    return new Observable((observer: Subscriber<any>) => {
      observer.next(this.init(key, json));
    })
  }
  //初始化
  init(key: string, json: any) {
    if (key == 'storeInfo') {
      return this.storeInfo(key, json);
    } else if (key == 'storeInfoList') {
      return this.storeInfoList(key, json);
    } else if (key == 'storeInfoBase') {
      return this.storeInfoBase(key, json);
    } else if (key == 'storeInfoAptitude') {
      return this.storeInfoAptitude(key, json);
    } else if (key == 'storeInfoAddress') {
      return this.storeInfoAddress(key, json);
    } else if (key == 'storeInfoScan') {
      return this.storeInfoScan(key, json);
     }if (key == 'commonStoreInfofile') {
      return this.commonStoreInfofile(key, json);
     }
   }
  //店铺APP 店铺信息
  storeInfo(key: any, json: any) { 
    let a = this.dataFilterConfig.setStoreInfoFn(json);
    this.setInit[key] = a;
    return a;
  }
  //二级链接
  storeInfoList(key: any, json: any) { 
    let a = this.dataFilterConfig.storeInfoList;
    return a
  }
  //基本信息
  storeInfoBase(key: any, json: any) {
    let a = this.dataFilterConfig.setStoreInfoBaseFn(json);
    this.setInit[key] = a;
    return a
  }
  //店铺资质
  storeInfoAptitude(key: any, json: any) {
    let a = this.dataFilterConfig.setStoreInfoAptitudeFn(json);
    return a
  }
  //店铺地址
  storeInfoAddress(key: any, json: any) { 
    let a = this.dataFilterConfig.setStoreInfoAddressFn(json);
    return a
  }
  //店铺二维码
  storeInfoScan(key: any, json: any) {
    let a = this.dataFilterConfig.setStoreInfoScanFn(json);
    return a 
  }
  //初始化店铺信息
  commonStoreInfofile(key: any, json: any) { 
    let a = this.dataFilterConfig.commonStoreInfofileFn(json);
    return a
  }

}
