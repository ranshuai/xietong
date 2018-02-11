import { CommonModel } from './../../../../providers/CommonModel';
import { HttpConfig } from './../../../../providers/HttpConfig';
import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Storage } from '@ionic/storage';
import { Config } from './config.model';
import { CommonProvider } from "../common/common";


/*
  Generated class for the ApiProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Api {

  domain: string;
  userId: number;
  space;
  UUID=this.getUUID();
  constructor(public http: Http,
    public storage: Storage,
    public config: Config,
    private common: CommonProvider,
    public httpConfig: HttpConfig,
    public commonModel:CommonModel
  ) {
    //微信独有
    if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'STOREAPPWX')
    { 
      this.space = window.localStorage.space;
    }
  }

  //微信独有
  private getUserIdByOpenId(openId) {
    return new Observable((observer: Subscriber<any>) => {
      let options = new RequestOptions({ headers: new Headers({ openId: openId, source: 'weixin', space: this.space, storeId: window.localStorage.storeId }) });
      this.http.post(this.config.host.org + 'v2/userlogin/third/openId/thridEmpower', null, options).map(res => res.json()).subscribe(data => {
        if (data.success) {
          let userId;
          if (data.result) {
            this.userId = userId = data.result.userId;
            this.commonModel.userId = data.result.userId
          }
          if (!userId) {
            this.common.showToast('网络错误，未获取到用户码');
            userId = 0; //假数据
          }
          observer.next(userId);
        } else {
          this.common.showToast(data.msg);
        }
      });
    });
  }

  getDomain() {
    if (this.domain) {
      return this.domain;
    } else {
      this.domain = this.config.domain;
      return this.domain;
    }
  }

  getUserId(needLogin?) {
    let openId = window.localStorage.getItem('openId');
    return new Observable((observer: Subscriber<any>) => {
        if (this.commonModel.userId) {
          this.cacheUserId(this.commonModel.userId);
          observer.next(this.commonModel.userId);
        } else if (needLogin) {//需要登录,跳转到登录页，默认为0
          this.common.goToPage('PublicLoginPage');
        } else {
          this.commonModel.userId = null;
          observer.next(this.commonModel.userId);
        }
    });
  }
  //缓存userId到自身
  cacheUserId(userId) {
    this.userId = userId;
  }

  injectHeaders(options, needLogin?, type?) {
    return new Observable(observer => {
      let domain = this.getDomain();
      this.getUserId(needLogin).subscribe((userId: any) => {
        if (options && options.headers) {//参数里有headers的情况
          options.headers.append("space", domain);
          if (!options.headers.get('userId')) {
            options.headers.append("userId", userId);
          }
        } else {//参数里没有headers的情况
          let headers = new Headers({ space: domain, userId: userId, });
          if (options) { //有options的情况
            options.headers = headers;
          } else { //没有options的情况
            options = new RequestOptions({ headers: headers });
          }
        }
        // 注入StoreId
        if (this.httpConfig.clientType == '2') { //2=店铺APP
          if (!options.headers.get('storeId')) { 
            options.headers.append("storeId",this.httpConfig.storeId);
          }
        } else { 
          if (window.localStorage.getItem('storeId')) { 
            if (!options.headers.get('storeId')) { 
              options.headers.append("storeId",window.localStorage.getItem('storeId'));
            }
          }
        }
        // if (type) {
        //   options.headers.append("storeId", type);
        //  }

        if (!options.headers.get('clientType')) {
          options.headers.append("clientType", this.httpConfig.clientType);
        }
        
        if (!options.headers.get('platform')) {
          options.headers.append("platform", this.httpConfig.platform);
        }
        // 注入CompanyId
        // options.headers.append("companyId", this.config.companyId);
        observer.next(options);
      });
    });
  }

  get(url: string, params?: any, options?: RequestOptions, needLogin?, type?: any) {
    return new Observable((observer: Subscriber<any>) => {
      this.injectHeaders(options, needLogin).subscribe((options: any) => {
        if (params) {
          let p = new URLSearchParams();
          for (let k in params) {
            p.set(k, params[k]);
          }
          options.search = p;
        }
        
        this.http.get(url, options).timeout(this.config.timeout).map(res => res.json()).subscribe(data => {
          observer.next(data);
        }, error => {
          this.common.showToast('网络错误，请稍后再试~');
          observer.next({ success: false });
        });
      });
    });
  }

  post(url: string, body?: any, options?: any, needLogin?:any, type?:any) {
    return new Observable((observer: Subscriber<any>) => {
      this.injectHeaders(options, needLogin,type).subscribe(options => {
        this.http.post(url, body, options).timeout(this.config.timeout).map(res => res.json()).subscribe(data => {
          observer.next(data);
        }, error => {
          // this.common.showToast('网络错误，请稍后再试~');
          observer.next({ success: false });
        });
      });
    });
  }

  put(url: string, body?: any, options?: any, needLogin?) {
    return new Observable((observer: Subscriber<any>) => {
      this.injectHeaders(options, needLogin).subscribe(options => {
        this.http.put(url, body, options).timeout(this.config.timeout).map(res => res.json()).subscribe(data => {
          observer.next(data);
        }, error => {
          this.common.showToast('网络错误，请稍后再试~');
          observer.next({ success: false });
        });
      });
    });
  }

  delete(url: string, params?: any, body?: any, options?: any, needLogin?) {
    return new Observable((observer: Subscriber<any>) => {
      this.injectHeaders(options, needLogin).subscribe((options: any) => {
        if (params) {
          options.params = params;
        }
        if (body) {
          options.body = body;
        }
        this.http.delete(url, options).timeout(this.config.timeout).map(res => res.json()).subscribe(data => {
          observer.next(data);
        }, error => {
          this.common.showToast('网络错误，请稍后再试~');
          observer.next({ success: false });
        });
      });
    });
  }
   //首页个人中心 信息初始化
   getUserInfo() {
    this.get(this.config.host.org + 'user/userinfo').subscribe(data => {
      if (data.success) {
      }
    });
   }
   getUUID() { 
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var n = 5, s = "";
    for(var i = 0; i < n; i++){
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
    }

    return s + (new Date().getTime());
  }

}
