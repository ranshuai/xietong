import { Component, Input } from '@angular/core';
import { RequestOptions, Headers } from '@angular/http';
import { Api } from "../../../providers/api/api";

/**
 * Generated class for the StoreTopicListComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'store-topic-list',
  templateUrl: 'store-topic-list.html'
})
export class StoreTopicListComponent {

  @Input() storeId: any;
  page: number = 1;
  row: number = 10;
  loadEnd: boolean = false;
  topicData = [];

  constructor(private api: Api) { }

  ngAfterViewInit() {
    this.doInfinite();
  }

  /**获取专题列表 */
  getList(refresher?) {
    if (this.loadEnd) {
      refresher && refresher.complete();
      return false;
    }
    this.api.get(this.api.config.host.bl + 'topic/list/store', {
      storeId: this.storeId,
      page: this.page,
      rows: this.row
    }, new RequestOptions({
        headers: new Headers({
          storeId: this.storeId,
      })
    })).subscribe(data => {
      if (data.success) {
        //如果是第一页就赋值  是其他就合并
        if (this.page == 1) {
          this.topicData = data.result;
        } else {
          this.topicData = this.topicData.concat(data.result)
        }

        if (data.result.length < this.row) {
          this.loadEnd = true;
        } else {
          this.loadEnd = false;
        }

        this.page++;
      }
      refresher && refresher.complete();
    });
  }

  /**上拉加载 */
  doInfinite(InfiniteScroll?) {
    this.getList(InfiniteScroll);
  }

}
