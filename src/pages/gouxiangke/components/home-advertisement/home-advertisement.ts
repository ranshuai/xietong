import { Component } from '@angular/core';

/**
 * Generated class for the HomeAdvertisementComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'home-advertisement',
  templateUrl: 'home-advertisement.html'
})
export class HomeAdvertisementComponent {

  text: string;

  constructor() {
    console.log('Hello HomeAdvertisementComponent Component');
    this.text = 'Hello World';
  }

}
