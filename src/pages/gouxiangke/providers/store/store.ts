import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Api } from '../api/api';
/*
  Generated class for the StoreProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StoreProvider {

  constructor(public api: Api) {
    console.log('Hello StoreProvider Provider');
  }

  getStoreInfo(storeId) {
    return this.api.get(this.api.config.host.bl + 'v2/CompanyInfo/get/index', { storeId: storeId });
  }

  collect(data) {
    return this.api.post(this.api.config.host.org + 'user/collect/company/add?companyId=' + data.storeId + '&type=' + data.status, {
      companyId: data.storeId,
      type: data.status
    });
  }

}
