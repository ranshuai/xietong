import { Config } from './../../gouxiangke/providers/api/config.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from "../../gouxiangke/providers/api/api";
import { RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

/*
  Generated class for the StoreAddGoodsSpecsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StoreAddGoodsSpecsProvider {
  //独角鲸店铺用的是companyId查询的，如果是域店铺，需要在这里缓存templateId，然后比对templateId是否变动来获取新数据
  specses;

  constructor(
    private api: Api,
    public config:Config
  ) {
  }

  get(templetId?) {
    return new Observable(observer => {
      if (this.specses) {
        observer.next(this.specses);
      } else {
        if (this.config.domain == '92E21DE17C0CE872') {
          this.api.post(this.api.config.host.bl + 'v2/goods/querySpecByStoreId').subscribe(data => {
            if (data) {
              this.specses = data.result;
              observer.next(this.specses);
            }
          });
        } else { 
          let headers = new Headers({ 'templetId': templetId });
          let option = new RequestOptions({'headers':headers})
          this.api.post(this.api.config.host.bl + 'v2/category/querySpecBytempletId', {
            templateId:10153
          },option).subscribe(data => {
            if (data) {
              this.specses = data.result;
              observer.next(this.specses);
            }
          });
        }
      }
    });
  };
}
