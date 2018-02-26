import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";
/**
 * Generated class for the SearchButtonComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-button',
  templateUrl: 'search-button.html'
})
export class SearchButtonComponent {

  @Input() shadowLeft: string;
  constructor(public common: CommonProvider,public navController:NavController) { }

  goToSearchPage() {
    this.navController.push('SearchPage');
  }

}
