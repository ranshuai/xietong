import { Component } from '@angular/core';

/**
 * Generated class for the HomePlatformComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'home-platform',
  templateUrl: 'home-platform.html'
})
export class HomePlatformComponent {

  text: string;

  constructor() {
    console.log('Hello HomePlatformComponent Component');
    this.text = 'Hello World';
  }

}
