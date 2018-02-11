import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';

/**
 * Generated class for the ApplyCompanyAuditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apply-company-audit',
  templateUrl: 'apply-company-audit.html',
})
export class ApplyCompanyAuditPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyCompanyAuditPage');
  }

}
