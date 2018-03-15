import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the ReasonradioListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reasonradio-list',
  templateUrl: 'reasonradio-list.html',
})
export class ReasonradioListPage {

  //接受单选列表的数据
  RadioListInfo: any;
  radioValue:any; //单选 
  /*
    3: {
        'RadioList' :[
          '拍错/多拍/不想要','商品质量有问题','版本/颜色等与商品描述不符','卖家发错货','其他'
        ],
        'title':'换货原因'
      }
  */

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    
    this.RadioListInfo = navParams.get('RadioListInfo');
    console.log(this.RadioListInfo);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReasonradioListPage');
  }

  close(title?,selectedValue?) { 
    console.log(selectedValue);
    if (this.viewCtrl.isOverlay) {
      let json ={
        title:title,
        selectedValue:selectedValue
      };
      this.viewCtrl.dismiss(json);
     }
  }

}
