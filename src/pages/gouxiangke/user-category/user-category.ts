import { Config } from './../providers/api/config.model';
import { GlobalDataProvider } from './../providers/global-data/global-data.model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RequestOptions, Headers } from '@angular/http';
import { Api } from './../providers/api/api';
/**
 * Generated class for the UserCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-category',
  templateUrl: 'user-category.html',
})
export class UserCategoryPage {
  private userCategoryListL: any;
  private userCategoryListR: any;
  private catId: any;
  private loadEnd: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api,public globalDataProvider:GlobalDataProvider,public config:Config ) {
  }

  ionViewDidEnter() {
    
    console.log('ionViewDidLoad UserCategoryPage');
    this.getList({ parentId: "list" }, id => {
      this.catId = id;
      console.log(this.catId)
      this.getList({ cateId: id, pageNo: 1, rows: 10 }, null);
    });
    
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave  Category=>当将要从页面离开时触发 ");
  }

  //获取分类列表
  getList(json, callback) {

    //店铺app和域App调用的分类接口不一样
    let categoryUrl
    if (this.config.PLATFORM == 'APP' || this.config.PLATFORM == 'WX') { 
      categoryUrl = 'v2/category/queryCategory'
    } else {
    }


    let SelfJson = {
      'APP': {
        'home': 'v2/category/queryCategory',
        'list': 'v2/category/queryCategory',
      }, 
      'WX': {
        'home': 'v2/category/queryCategory',
        'list':'v2/category/queryCategory'
      },
      'STOREAPP': {
        'home': 'v2/category/queryHomeCategory',
        'list':'v2/goods/queryGoodsList'
      },
      'STOREAPPWX': {
        'home': 'v2/category/queryHomeCategory',
        'list':'v2/goods/queryGoodsList'
      }
    } 

    let headers = new Headers({ cateId: 0 }); 
    let options =new RequestOptions({ headers: headers })
    if (json.parentId == "list") {
      if (this.config.PLATFORM == 'STOREAPP' || this.config.PLATFORM == 'STOREAPPWX') {
        this.api.get(this.api.config.host.bl +SelfJson[this.config.PLATFORM].home,'',options).subscribe(data => {
          if (data.success && data.result.length>0) {
            this.firstAndSend(json.parentId, data);
            callback && callback(data.result[0].id);
          }
        })
      } else { 
        this.api.post(this.api.config.host.bl +SelfJson[this.config.PLATFORM].home,'',options).subscribe(data => {
          if (data.success && data.result.length>0) {
            this.firstAndSend(json.parentId, data);
            callback && callback(data.result[0].id);
          }
        })
      }
    } else {
      let headers = new Headers({ cateId: json.cateId}); 
      let options =new RequestOptions({ headers: headers })
      this.api.post(this.api.config.host.bl + SelfJson[this.config.PLATFORM].list, json,options).subscribe(data => {
        if (data.success && data.result.length>0) {
          this.firstAndSend(json.parentId, data);
          callback && callback(data.result[0].id);
        }
      })
    }
  }
  //一级 || 二级  分类
  firstAndSend(id, data) {
    if (id == "list") {
      this.userCategoryListL = data.result;
    } else {
      this.userCategoryListR = data.result;
      if (data.result.length >= 10) {
        this.loadEnd = false;
      } else { 
        this.loadEnd = true;
      }
    }
  }

  idFromChildren(id: number) {
    this.catId = id;
    console.log(this.catId)
    this.getList({ cateId: id, pageNo: 1, rows: 10 }, null);
  }
}
