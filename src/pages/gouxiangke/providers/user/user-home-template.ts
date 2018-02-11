import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from "../api/api";

/*
  Generated class for the UserHomeTemplateProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserHomeTemplateProvider {

  constructor(public api: Api) { }

  getHomeTemplate() {
    return new Observable((observer: Subscriber<any>) => {
      this.api.post(this.api.config.host.bl + 'v2/homePage/selectStoreTemplet').subscribe(data => {
        if (data.success) {
          observer.next(data);
        }
      });
    });
  }

  getHomeAd() {
    return new Observable((observer: Subscriber<any>) => {
      this.api.get(this.api.config.host.bl + 'v2/homePage/homeAdLoad').subscribe(data => {
        if (data.success) {
          observer.next(data);
        }
      });
    });
  }

}
