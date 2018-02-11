import { CommonModel } from './../../../../providers/CommonModel';
import { Storage } from '@ionic/storage';
import { Component, Output, EventEmitter,ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController,Events,Content} from 'ionic-angular';
import { Api} from '../../providers/api/api'
import { RequestOptions, Headers } from '@angular/http';
import { CommonProvider} from'../../providers/common/common'
import { GoodsSpecsDetailGroupPage } from "./goods-detail-group-specs/goods-detail-group-specs";


@Component({
	selector:'page-goods-detail-group',
	templateUrl:'goods-detail-group.html'
})
export class GoodsDetailGroupPage{
    @ViewChild(Content) content: Content;
	goodsId : string;
	goodsInfo : any;
    groupInfo:any;
    goodsSpecsDetailGroupPage = GoodsSpecsDetailGroupPage

    @Output() openSpecsModalEmit = new EventEmitter();

    constructor(
        public api: Api,
        public navParams : NavParams,
        public commonProvider : CommonProvider,
        public modalCtrl: ModalController,
        public storage: Storage,
        public events: Events,
        public commonModel:CommonModel
        ){
        this.goodsId = navParams.get('goods_id');
        //注册事件
        this.events.subscribe('goodsGroup:contentTop', () => { 
            // console.log('事件监听');
            this.content.scrollTo(0, 558,0);
        })
    }
    //页面初始化
    ionViewDidEnter() {
        this.init();
    }

    init(){
    	this.getInfo();
    }

    getInfo(){
    	this.api.get(this.api.config.host.bl+'v2/goods/detail/'+this.goodsId).subscribe(data=>{
    		if(data.success){
    			this.goodsInfo = data.result;
    		}else{
    			this.commonProvider.tostMsg({'msg':data.msg})
    		}
    	})
        this.api.get(this.api.config.host.bl+'group/query/'+this.goodsId+'/details').subscribe(data=>{
            if(data.success){
                this.groupInfo = data.result;
            }else{
                this.commonProvider.tostMsg({'msg':data.msg})
            }
        })
    }

    //打开规格弹窗
    openModal(json, id) {
        //是否已经有userId
        if (this.commonModel.userId) {
            let options: any;
            let headers = {
                promisonId: id,
            };
            options = new RequestOptions({
                headers: new Headers(headers)
            });
   
            this.api.get(this.api.config.host.bl + 'group/join', {}, options).subscribe(data => {
                if (data.success) {
                    if (data.result == '10002' || data.result == '10003') {
                        this.commonProvider.tostMsg({ 'msg': data.msg })
                    } else {
                        let specsModal = this.modalCtrl.create(
                            this.goodsSpecsDetailGroupPage,
                            { goods: this.goodsInfo, price: json.price, promisonId: id, view: 'goodsDetail' },
                            { cssClass: 'specs-modal' }
                        );
                        specsModal.present();
                    }
                } else {
                    this.commonProvider.tostMsg({ 'msg': data.msg })
                }
            })
        } else { 
            this.commonProvider.goToPage('PublicLoginPage')
        }
    }
}
