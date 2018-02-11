import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { RequestOptions, Headers } from '@angular/http';
import { Api } from '../../../gouxiangke/providers/api/api';
import { CommonProvider } from '../../../gouxiangke/providers/common/common';
/**
 * Generated class for the UserInfoPrepayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-info-prepay',
  templateUrl: 'user-info-prepay.html',
})
export class UserInfoPrepayPage {

  pageData = {
    loadEnd: false,
    page: 1,
    rows: 5,
    list:null
  };

  //页面是否渲染完毕
  viewIsEnd = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private api: Api, private loadingCtrl: LoadingController,
  private common:CommonProvider) {
    this.getPrepay()
  
  }

  




  /**
   * 获取预付款余额
   */
  getPrepay() {
  let headers ={
      clientType:this.api.config.type,
  };
  var options = new RequestOptions({
      headers: new Headers(headers)
  });
  
  let loading = this.loadingCtrl.create({
    dismissOnPageChange: true,
    content: '请稍后...'
  });
  loading.present();  
    this.api.get(this.api.config.host.org + 'preFinanceAccount/queryPreFinanceAccountDetail', {
      storeId: this.api.config.STOREID
    }, options).subscribe(data => { 
     
      if (data.success) {
        this.pageData['money'] = data.result;
        this.getQueryWallet();
      } else { 
        this.common.showToast(data.msg||'请刷新重试');
      }
    })
  }
 
  


  getQueryWallet(refresher?) {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '请稍后...'
    });
    loading.present(); 
    if (this.pageData.loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.org + '/preFinanceAccountLog/queryPreFinanceAccountList', {
      pageNo: this.pageData.page,
      rows: this.pageData.rows
    }).subscribe(data => {
      
      if (data.success) {
        if (this.pageData.page == 1) {
          this.pageData.list = data.result;
        } else {
          this.pageData.list = this.pageData.list.concat(data.result)
        }
        let row = data.result.length;
        this.pageData.loadEnd = row >= this.pageData.rows ? false : true;
        this.pageData.page++;
        refresher && refresher.complete();
      } else {
        this.common.tostMsg({ msg: data.msg })
      }
      loading.dismiss(); 
      refresher && refresher.complete();
      this.viewIsEnd = true;
    })
  }
  /**上拉加载 */
  doInfinite(InfiniteScroll) {
    this.getQueryWallet(InfiniteScroll);
  }
  /**下拉刷新 */
  refresh(refresher?) {
    this.pageData.page = 1;
    this.pageData.loadEnd = false;
    this.getQueryWallet(refresher);
  }


  


}
