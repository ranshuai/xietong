import { Component, Input } from '@angular/core';
import { Api } from "../../providers/api/api";

/**
 * Generated class for the GoodsDetailCommentComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'goods-detail-comment',
  templateUrl: 'goods-detail-comment.html',
})
export class GoodsDetailCommentComponent {

  @Input() data: any;

  view: string = 'detail';

  constructor(public api: Api) { }

  switchPage(view) {
    this.view = view;
  }

  // loadMore() {
  //   this.api.get(this.api.config.host.bl);
  // }
}
