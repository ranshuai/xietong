import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserTopicDetailsPage } from "../../user-topic/user-topic-details/user-topic-details"
import { CommonProvider } from '../../providers/common/common';

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
  @Input() data: any;
  userTopicDetailsPage = UserTopicDetailsPage;
  constructor(private navCtrl:NavController,private common: CommonProvider) {

  }
  goToDetail(adLink) {
    if (adLink&&adLink != 0) {
      this.common.goToPage(this.userTopicDetailsPage, { id: adLink });
    }
  }
}
