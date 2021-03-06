import { NavController } from 'ionic-angular';
import { Component, Input, forwardRef, Inject } from '@angular/core';
import { CommonProvider } from "../../providers/common/common";
// import { UserTopicDetailsPage } from "../user-topic-details/user-topic-details"

/**
 * Generated class for the UserTopicListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'user-topic-list',
  templateUrl: 'user-topic-list.html',
})

export class UserTopicListComponent {

  @Input() data: any;

  userTopicDetailsPage = 'UserTopicDetailsPage'

  constructor(public common: CommonProvider,public navCtrl:NavController) { }

  goTopic(_topicId) {
    this.navCtrl.push(this.userTopicDetailsPage, { id: _topicId })
  }

}
