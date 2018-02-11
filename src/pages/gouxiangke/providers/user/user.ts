import { CommonModel } from './../../../../providers/CommonModel';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class User {

  user: any;

  constructor(
    public api: Api,
    public storage: Storage,
    public commonModel:CommonModel
  ) { }
  //缓存用户信息
  loggedIn(user) {
    console.log(user);
    this.user = user;
    this.commonModel.userId =  user.userId || user.userid;
    this.storage.set('userId', user.userId || user.userid);
    this.storage.set('storeId', user.storeId || user.storeid );
    this.api.cacheUserId(user.userId || user.userid); //让api缓存上userId
  }
  //获取用户信息
  getUserInfo() {
    return new Observable((observer: Subscriber<any>) => {
      this.api.get(this.api.config.host.org + 'user/userinfo', null, null, true).subscribe(data => {
        if (data.success) {
          this.loggedIn(data.result);
          observer.next(data);
        }
      });
    });
  }
  //清除用户和店铺ID
  clearLogin() {
    return new Observable((observer: Subscriber<any>) => {
      this.user = null;
      this.api.userId = 0;
      this.commonModel.userId = null;
      window.localStorage.setItem('storeId', '')
      this.storage.set('userId', '');
      this.storage.set('userId', '');
      observer.next(true);
    });
  }
  //退出店铺
  quitStoreLogin() { 
    return new Observable((observer: Subscriber<any>) => {
      observer.next(true);
    });
  }

}
