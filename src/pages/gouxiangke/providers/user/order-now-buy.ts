import { Injectable } from '@angular/core';
import { GlobalDataProvider } from "../../providers/global-data/global-data.model";

/*
  Generated class for the OrderNowBuyProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OrderNowBuyProvider {

  private data: any;

  constructor(private globalData: GlobalDataProvider) { }

  setData(data) {
    this.globalData.isNowBuy = true;
    this.data = data;
  }

  getData() {
    return this.data;
  }

}
