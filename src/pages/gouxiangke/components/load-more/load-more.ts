import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the LoadMoreComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'load-more',
  templateUrl: 'load-more.html'
})
export class LoadMoreComponent {

  @Input() noMoreText: string;
  @Output() doInfiniteEmit = new EventEmitter();
  @Output() complete = new EventEmitter();

  hasMore: Boolean = true;
  page: number = 1;

  constructor() { }

  doInfinite(infiniteScroll?, refresher?) {
    // 推送出一个事件，该事件包含一个回调函数
    // 该回调，需要四个参数，一个父级的this，api返回的result，需要的key名，父级保存数据的key名
    this.doInfiniteEmit.emit((parentScope, data, resultKey, dataKey) => {
      refresher && refresher.complete();
      infiniteScroll && infiniteScroll.complete();

      if (data) {
        resultKey && (data = data[resultKey]);

        if (parentScope.page == 1) {
          parentScope[dataKey] = data;
        } else {
          parentScope[dataKey] = [...parentScope[dataKey], ...data];
        }
        parentScope.page++;

        if (data.length < parentScope.rows) {
          this.hasMore = false;
        } else {
          this.hasMore = true;
        }

        //以下代码，兼容搜索页，需要自己展示内容为空的情况
        this.page = parentScope.page - 1;
        let isDataNull = true;
        if (data && data.length != 0 || this.page != 1) {
          isDataNull = false;
        }
        this.complete.emit(isDataNull);
      }
    });
  }

  init(refresher?) {
    this.doInfinite(null, refresher);
  }

}
