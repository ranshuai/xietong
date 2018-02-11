import { UserCommon } from './../../providers/user/user-common';
import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
/**
 * Generated class for the UserHomeTopComponent component.
 * 
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'user-home-top',
  templateUrl: 'user-home-top.html'
})
export class UserHomeTopComponent {
  //知识共享是否显示
  getKnowledgeTab: boolean;
  
  @ViewChild(Slides) slides: Slides;
  @Output() changedNavEmit = new EventEmitter();

  activeIndex: number = 0;

  constructor(public navCtrl: NavController,public userCommon:UserCommon) {
    this.getKnowledgeTab = this.userCommon.getKnowledgeTab({'space':window.localStorage.getItem('sacpe')});

  }

  changedNav() {
    this.activeIndex = this.slides.getActiveIndex();
    if (this.activeIndex >= 4) return;
    this.changedNavEmit.emit(this.activeIndex);
  }

  changeNav(index) {
    // this.slides.slideTo(index);
    this.changedNavEmit.emit(index);
  }

}
