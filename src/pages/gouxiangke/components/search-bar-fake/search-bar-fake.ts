import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the SearchBarFakeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-bar-fake',
  templateUrl: 'search-bar-fake.html'
})
export class SearchBarFakeComponent {

  @Input() placeholder: string;

  constructor(
    public common: CommonProvider,
  ) { }

  goToSearchPage() {
    this.common.goToPage('SearchPage');
  }

}
