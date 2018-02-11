import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GlobalDataProvider } from "../../providers/global-data/global-data.model";

/**
 * Generated class for the SearchBarComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-bar',
  templateUrl: 'search-bar.html'
})
export class SearchBarComponent {

  @Input() placeholder: string;
  @Input() right: Boolean = false;
  @Input() clear: Boolean = false;
  @Output() searchEmit = new EventEmitter();

  searchValue: string;

  constructor(private globalData: GlobalDataProvider) { }

  search() {
    this.searchEmit.emit(this.searchValue);
  }

  focus() {
    this.globalData.hideUserTabs = true;
  }

  blur() {
    this.globalData.hideUserTabs = false;
  }

  clearAc() {
    this.searchValue = null;
  }

}
