import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../api/api';
import { GlobalDataProvider } from "../global-data/global-data.model";

/*
  Generated class for the AddressProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderAddressProvider {

  public data: any;

  constructor(private api: Api, private globalData: GlobalDataProvider) { }

  getAddressList() {
    return this.api.get(this.api.config.host.bl + 'address/all');
  }

  getDefaultAddress() {
    return new Observable((observer: Subscriber<any>) => {
      this.getAddressList().subscribe(data => {
        if (data.success) {
          let list = data.result;
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.isDefault) {
              observer.next(item);
              return;
            }
          }
        }
      });
    });
  }

  getOrderAddres() {
    return new Observable((observer: Subscriber<any>) => {
      if (this.data) {
        observer.next(this.data);
      } else {
        this.getDefaultAddress().subscribe(data => {
          observer.next(data);
        });
      }
    });
  }

}
