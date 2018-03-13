import { MainCtrl } from './../../../../providers/MainCtrl';
import { Component, Input, ViewChild } from '@angular/core';
import { Slides,NavController } from "ionic-angular";
import { CommonProvider } from "../../providers/common/common";
// import { UserTopicDetailsPage } from "../../user-topic/user-topic-details/user-topic-details"

/**
 * Generated class for the UserHomeAdComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-home-ad',
  templateUrl: 'user-home-ad.html'
})
export class UserHomeAdComponent {

  userTopicDetailsPage = 'UserTopicDetailsPage';

  @Input() data: any;
  @ViewChild('ionSlides') slide: Slides;

  constructor(
    private common: CommonProvider,
    private navController: NavController,
    public mainCtrl:MainCtrl
  ) {
  }

  goToDetail(event) {
    let index;
    if (event.realIndex > this.data.length) {
      index = 0;
    } else {
      index = event.realIndex;
    }
    let adLink = this.data[index].adLink;
    if (adLink&&adLink != 0) {
      this.navController.push(this.userTopicDetailsPage, { id: adLink });
    }
  }
  goToDetailV2(event) {
    let index;
    if (event.realIndex > this.data.length) {
      index = 0;
    } else {
      index = event.realIndex;
    }
    let adLink = this.data[index].adLink;
    if (adLink&&adLink != 0) {
      this.navController.push(this.userTopicDetailsPage, { id: adLink , version:2});
    }
  }
  //用户操作swiper之后，默认是禁止autoplay，需要手动开启 方法有问题（有时页面报错没有 hasAttrbuite）
  autoPlay() { 
      this.slide.startAutoplay();
  }

}
