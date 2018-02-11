import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonModel} from "../../../providers/CommonModel";
import {HttpService} from "../../../providers/HttpService";
import {HttpConfig} from "../../../providers/HttpConfig";

/**
 * Generated class for the UserInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user-info',
    templateUrl: 'sns-user-info.html',
})
export class SnsUserInfoPage {
    toUserId;
    toUserName;
    userInfo;
    headPic;
    isSelf=false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public commonModel: CommonModel,
                public httpService:HttpService,public httpConfig:HttpConfig) {
        this.toUserId = this.navParams.get("userId");
        this.toUserName = this.navParams.get("nickName");
        this.headPic = this.navParams.get("headPic");

    }

    queryUserInfo() {
        let reqData={
            uid:this.toUserId
        };
        if(this.toUserId==this.commonModel._userId){
            this.isSelf=true;
            reqData=null;
        }
        this.httpService.get(this.httpConfig.host.org+"sns/user/getUserInfo",reqData)
        /*this.httpService.get(this.httpConfig.host.org+"sns/user/getUserInfo",null,{
            userId:this.toUserId
        })*/
            .subscribe((data) => {
                if (data.success) {
                    this.userInfo=data.result;
                }
            });
    }

    ionViewDidEnter() {
        //  查询用户信息
        this.queryUserInfo();
        console.log('ionViewDidEnter SnsUserInfoPage');
    }

    sendMessage() {
        this.navCtrl.push("ChatPage", {
            "toUserId": this.toUserId,
            "toUserName": this.toUserName
        })
    }

    setInfo() {
        //进入用户设置页面
        this.navCtrl.push("UserInfoSetPage", {
            "userId": this.toUserId,
            "nickName": this.toUserName,
            "state": this.userInfo.state,//是否黑名单。1正常 2拉黑状态
            "wayType": this.userInfo.wayType//好友关系 0 自己 1好友 3 陌生人
        });

    }
}
