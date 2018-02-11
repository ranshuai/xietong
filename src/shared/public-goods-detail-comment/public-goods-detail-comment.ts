import { Component, Input } from '@angular/core';

/**
 * Generated class for the GoodsDetailCommentComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'public-goods-detail-comment',
  templateUrl: 'public-goods-detail-comment.html',
})
export class PublicGoodsDetailCommentShared {

  @Input() data: any;

  view: string = 'detail';

  constructor() { }

  switchPage(view) {
    this.view = view;
  }

}
