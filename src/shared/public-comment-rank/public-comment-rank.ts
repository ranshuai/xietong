import { Component, Input } from '@angular/core';

/**
 * Generated class for the CommentRankComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'public-comment-rank',
  templateUrl: 'public-comment-rank.html'
})
export class PublicCommentRankShared {

  @Input() data;

  constructor() { }

  outGoodStar() {
    let array = new Array(parseInt(this.data));
    return array;
  }

  outBadStar() {
    let array = new Array(5 - parseInt(this.data));
    return array;
  }

}
