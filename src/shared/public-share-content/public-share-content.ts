import { Component, Input } from '@angular/core';

/**
 * Generated class for the PublicShareContentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'public-share-content',
  templateUrl: 'public-share-content.html',
})
export class PublicShareContentShared {
  @Input() data: any;
  constructor(
  ) {
  }

  shareHide: boolean=true;
  shareHide2: boolean = true;
  
  arrows: any = {
    transform: 'rotate(-90deg)'
  }
  arrows2: any = {
    transform: 'rotate(-90deg)'
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad PublicShareContentPage');
  }

  sharedContentHide(num) {
    console.log(num)
    if(num==1){
      this.shareHide = !this.shareHide;
      !this.shareHide? this.arrows.transform = "rotate(-180deg)" : this.arrows.transform = "rotate(-90deg)";
    }else{
      this.shareHide2 = !this.shareHide2;
      !this.shareHide2 ? this.arrows2.transform = "rotate(-180deg)" : this.arrows2.transform = "rotate(-90deg)";
    }
  }

}
