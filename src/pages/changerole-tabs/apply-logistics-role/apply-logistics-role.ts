import { MainCtrl } from './../../../providers/MainCtrl';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams,IonicPage, LoadingController } from 'ionic-angular';
import { Validators } from '../../../providers/Validators';


/**
 * Generated class for the ApplyLogisticsRolePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-apply-logistics-role',
  templateUrl: 'apply-logistics-role.html',
  })

export class ApplyLogisticsRolePage {
  applyRoleInfo :any = window.localStorage.getItem('userIdentity') ;

  applyFormData = {
    person: null,
    idCard: null,
    checked: true,
    investMobile:null
  };
  applyRoleConfig = {
    1: '招商人',
    2: '物流人',
    3: '员工',
    4: '公司',
    5: '专家',
  }
  cardType: any;
  applyRoleParmJson = {
    3:1
  }
  applyRoleParm = {
    roleid:'2',
    belonCompanyid: '',
   }

  applyFormMsg:any = {
    person: {
      errorMsg: '',
      required: '姓名是必填的',
      chinese:'必须是中文',
    },
    idCard: {
      errorMsg: '',
      required: '身份证是必填的',
    },
    checked: {
      errorMsg: '',
      required: '',
    },
  }

  catId:number;
  applyForm: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl:LoadingController,
    public formBuilder: FormBuilder,
    private mainCtrl: MainCtrl
  ) {
    this.cardType = navParams.get('cardType');

    this.applyRoleParm = {
      roleid:this.applyRoleParmJson[this.cardType] || '2',
      belonCompanyid: '',
    }
    console.log(JSON.parse(window.localStorage.getItem('userIdentity')));
    console.log(JSON.parse(this.applyRoleInfo));
    this.applyForm = this.formBuilder.group({
      person: [JSON.parse(this.applyRoleInfo).idCardName, [Validators.required, Validators.chinese, Validators.maxLength(10)]],
      idCard: [JSON.parse(this.applyRoleInfo).idCard, [Validators.required, Validators.maxLength(18), Validators.idcard]],
      checked: [this.applyFormData.checked, [Validators.required]],
      investMobile:[this.applyFormData.investMobile]
    });
    this.applyForm.valueChanges.subscribe(data => {
      let verifyMessages = this.applyFormMsg;
      for (let field in verifyMessages) {
        verifyMessages[field].errorMsg = '';
        let control = this.applyForm.get(field);
        if (control && control.dirty && !control.valid) {
          let message = verifyMessages[field];
          for (let key in control.errors) {
            message[key] && (verifyMessages[field].errorMsg += message[key] + ' ');
          }
        }
      }
      Object.assign(this.applyFormData, this.applyForm.value);
    })
  }

  //查看协议
  viewProtocol(cardType:any){
    //59招商合伙人协议 60注册配送员协议
    this.catId = cardType == 1 ? 59 : 60;
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.bl + 'platformset/selectProtocolInfo',{
      catId:this.catId
    }).subscribe(data=>{
      if(data.success){
        this.navCtrl.push('AllProtocolPage',{data:data.result.content,cardType:this.cardType});
      }else{
        this.mainCtrl.nativeService.showToast(data.msg);
      }
    })
  }


  submit() {
    //检测 协议书按钮是否勾选
    if(!this.applyFormData.checked){
      this.mainCtrl.nativeService.showToast("请勾选协议!");
      return false;
    }

    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: '提交中，请稍后...'
    });
    loading.present();
    this.mainCtrl.httpService.post(this.mainCtrl.httpService.config.host.org + 'v2/user/openStaffNew',{
      roleid:this.navParams.get('cardType') || '2',
      belonCompanyid: '',
      agentUserMobile:this.applyFormData.investMobile
    }).subscribe(data =>{
      loading.dismiss();
      if (data.success) {
        let title = this.navParams.get('cardType') == 1  ? "恭喜您,成为招商合伙人~" :  "申请成功,等待后台审核~";
        // this.navCtrl.push('LogisticsPage');
        this.mainCtrl.nativeService.showToast(title);
        setTimeout(() => { 
          this.mainCtrl.setRootPage('TabMenuPage');
        }, 1000)
      } else {
        this.mainCtrl.nativeService.showToast(data.msg)
        // this.navCtrl.push('ApplyLogisticsFailPage');
      }
    })
  }
  ionViewDidLoad() {

  }

}
