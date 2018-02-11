import {Component} from '@angular/core';
import {IonicPage, ActionSheetController, NavController, NavParams} from 'ionic-angular';
import {CommonModel} from "../../../providers/CommonModel";
import {HttpService} from "../../../providers/HttpService";
import {HttpConfig} from "../../../providers/HttpConfig";
import {MainCtrl} from "../../../providers/MainCtrl";

/**
 * Generated class for the UserInfoSetPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user-info-set',
    templateUrl: 'user-info-set.html',
})
export class UserInfoSetPage {
    userId;
    nickName;
    state;
    wayType;
    isOpen = false;
    isSelf = false;
    isShowDelete=true;
    constructor(public navCtrl: NavController, public navParams: NavParams, public commonModel: CommonModel
        , public httpService: HttpService, public httpConfig: HttpConfig, public actionSheetCtrl: ActionSheetController,
                public mainCtrl:MainCtrl) {
        this.userId = this.navParams.get("userId");
        this.nickName = this.navParams.get("nickName");
        this.state = this.navParams.get("state");//是否黑名单。1正常 2拉黑状态
        this.wayType = this.navParams.get("wayType");//好友关系 0 自己 1好友 3 陌生人
        this.isOpen=this.state==2?true:false;//初始化黑名单开关
        // if (this.userId == this.commonModel["_userId"]) {//展示自己设置页面
        if (this.wayType ==0) {//展示自己设置页面
            this.isSelf = true;
        }else if(this.wayType ==1){
            //好友显示删除按钮
            this.isShowDelete=true;
        }else if(this.wayType==3){
            this.isShowDelete=false;
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad UserInfoSetPage');
    }

    /**
     * 黑名单开关
     */
    blackListSwitch() {
        console.log('黑名单开关状态变化了', this.isOpen);
        let url = this.httpConfig.host.org + "sns/user/updateUserInfo";
        // let url="assets/json/sns/attention.json";
        let type = this.isOpen==true?2:1;
        this.httpService.post(url, {beUserId: this.userId, type: type}).subscribe((data)=>{
            console.log("操作黑名单开关成功，type:",type,data);
        });
    }

    setBlackList() {
        this.navCtrl.push("BlackListPage");
    }

    showDeleteDialog() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '将联系人' + this.nickName + '删除,同时删除与该联系人的聊天',
            buttons: [
                {
                    text: '删除联系人',
                    handler: () => {
                        console.log('Archive clicked');
                        this.deleteFriend();
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    deleteFriend() {
        let url = this.httpConfig.host.org + this.httpConfig.version + "sns/user/deleteFriends";
        // let url="assets/json/sns/attention.json";
        this.httpService.post(url, {beUserId: this.userId})
            .subscribe((data) => {
                if (data.success) {
                    console.log("删除好友成功");
                    this.mainCtrl.nativeService.showToast("删除好友成功");
                    this.navCtrl.pop();
                    //   界面上展示好友列表数据
                }
            })
    }

    ionViewDidLeave() {

    }

    /**
     * 是否拉黑 -未用到
     */
    isAddBlackList() {   // this.isOpen

        let type;
        let isRequest = false;
        if (this.isOpen && this.state == 1) {
            //    正常状态，拉黑
            type = 2;
            isRequest = true;
        } else if (!this.isOpen && this.state == 2) {
            //    拉黑状态，取消拉黑
            type = 1;
            isRequest = true;
        }
        if (isRequest) {
            let url = this.httpConfig.host.org + this.httpConfig.version + "/sns/user/updateUserInfo";
            // let url="assets/json/sns/attention.json";
            this.httpService.get(url, {beUserId: this.userId, type: type})
                .subscribe((data) => {
                    if (data.success) {
                        console.log("设置拉黑操作成功");
                        //   界面上展示好友列表数据
                    }
                })
        }
    }
}
