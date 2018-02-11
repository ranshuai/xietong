import {Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * Generated class for the UserTopicListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'user-category-list-L',
  templateUrl: 'user-category-list-L.html',
})
export class UserCategoryListLComponent {
  @Input() public data: any;
  public _index: any;
  @Output() private outerId = new EventEmitter<number>();

  constructor() {
  }
  ngOnChanges() { 
    this._index = 0;
  }
  
  idToParent(id:number,i:number){
    this._index = i;
    this.outerId.emit(id);
  }
}
