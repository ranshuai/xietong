import { Utils } from './../../../../providers/Utils';
import { CommonProvider } from './../../providers/common/common';
import { Component, Input } from '@angular/core';
import { ModalController } from "ionic-angular";
// import { ChangeRolesPage } from "../../pages/change-roles/change-roles";
/**
 * Generated class for the ChangeRolesBtnComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'change-roles-btn',
  templateUrl: 'change-roles-btn.html'
})
export class ChangeRolesBtnComponent {
  @Input() noSelectCard;
  @Input() type;
  // changeRolePage = ChangeRolesPage;
  json = {
    1: '确定返回商城首页吗？',
    2: '确定退出物流人吗？',
    3: '确定返回商城首页吗？',
    4: '确定返回商城首页吗？',
    5: '确定返回商城首页吗？',
    6: '确定返回商城首页吗？'
  }
  constructor(
    private modalCtrl: ModalController,
    public commonProvider: CommonProvider,
    public utils:Utils
  ) { 


  }

  openChangeModal() {
    console.log(this.noSelectCard);
    if (this.noSelectCard) {
      this.commonProvider.comConfirm(this.json[this.type]).subscribe((data) => { 
        if (data) {
          this.commonProvider.goToPage('UserPage')
         }
      })
      return 
    } else {
      this.utils.openModal('ChangeroleTabsPage').subscribe();
    }


    // let changeModal = this.modalCtrl.create(this.changeRolePage);
    // changeModal.present({ animate: false });
  }
 
}
