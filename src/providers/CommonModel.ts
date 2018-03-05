/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class CommonModel {
  public shoppingCartHide: any; //购物车是否隐藏
  public canActive: boolean = true; //用户能否点击 限制用户多次操作
  public cacheOtherGoodsListLength: number = 0; //店铺管理 准备代售商品的数量
  public freightOrderGoods: number = 0; //运费
  public pageOrderConfirmSelfInfo: any = {}; //缓存订单相关的信息
  public pageOrderConfirm: any = {}; //缓存点击配送方式的下表和店铺Id
  public userDefaultAndSetAddres: any = {}; //用户默认和选中的地址
  public pageOrderConfirmpick: any = {}; //点击购物车进入订单确认页面
  public isPayPwd: any;
  shopCarNum: any; //店铺购物车显示数量的角标；
  private _mode: string = 'dark';//日间模式dark  light夜间模式
  private _showLoading: boolean = true; //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false

  //gxk 配置信息
  public _userId: string;//用户id
  //---融云测试用by mwh start --
  public rongIMInfo;
  public _userNickName: string;//用户id
  public _userPortrait: string;//用户id
  public _targetId: string;//对方用户id
  public _targetNickName: string;//对方用户id
  public _targetPortrait: string;//对方用户id
  public _imToken: string;//融云token
  public _msgContent: string;//融云token
  //---融云测试用 by mwh end --
  public _TAB_INIT_USERINFO: any;//所有卡牌公用用户信息
  private _user_info_wallet: any;

  /**微信init配置信息 */
  public APP_INIT: any = {};//微信项目初始化数据信息
  public APP_INIT_LOADING: boolean = false;//项目初始化是否加载完毕
  public APP_INIT_ERROR: boolean = false;//项目初始化过程中是否报错
  /**************知识共享专用start*******************/
  private _userInfo: any = {};//购享客用户信息
  private _doMain: any = {}; //领域 税种 专题等全局配置信息
  private _pageInit: any = { //支付完成页面后 刷新页面此值是true
    "tab-interlocution": false,
  }
  private _expertCaceData: any = {};  //缓存申请专家的数据
  private _updateExpertInfoForApply: boolean = false;//申请专家是否被驳回
  private _classicCases: any = []; //保存经典案例的数据
  private _interva = {   //获取时间定时器
    "login": 60,
    "register": 60,
    "verification": 60,
    "verifications": 60,
    "setPassword": 60,
    "changeMobile": 60,
    'walletWithdrawals': 60,
    'modifyMobile': 60,
    'thirdlogin':60
  };
  private _classroomDomain: any = {//新建讲堂缓存数据
    industry: {
      list: [],
      activeList: []
    },
    tax: {
      list: [],
      activeList: []
    },
    topic: {
      list: [],
      activeList: []
    },
    industryQuality: {
      list: [],
      activeList: []
    }
  };



  /**************知识共享专用end*******************/
  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }


  get showLoading(): boolean {
    return this._showLoading;
  }

  set showLoading(value: boolean) {
    this._showLoading = value;
  }

  get mode(): string {
    return this._mode;
  }

  set mode(value: string) {
    this._mode = value;
  }

  get TAB_INIT_USERINFO(): any {
    return this._TAB_INIT_USERINFO;
  }

  set TAB_INIT_USERINFO(value: any) {
    this._TAB_INIT_USERINFO = value;
  }

  get userInfo(): any {
    return this._userInfo;
  }
  set userInfo(value: any) {
    this._userInfo = value;
  }

  get doMain(): any {
    return this._doMain;
  }
  set doMain(value: any) {
    this._doMain = value;
  }
  get pageInit(): any {
    return this._pageInit;
  }
  set pageInit(value: any) {
    this._pageInit = value;
  }

  get expertCaceData(): any {
    return this._expertCaceData;
  }
  set expertCaceData(value: any) {
    this._expertCaceData = value;
  }

  get updateExpertInfoForApply(): boolean {
    return this._updateExpertInfoForApply;
  }
  set updateExpertInfoForApply(value: boolean) {
    this._updateExpertInfoForApply = value;
  }


  get classicCases(): boolean {
    return this._classicCases;
  }

  set classicCases(value: boolean) {
    this._classicCases = value;
  }
  get interva(): any {
    return this._interva;
  }
  set interva(value: any) {
    this._interva = value;
  }
  get classroomDomain(): any {
    return this._classroomDomain;
  }
  set classroomDomain(value: any) {
    this._classroomDomain = value;
  }
  get user_info_wallet(): any {
    return this._user_info_wallet;
  }
  set user_info_wallet(value: any) {
    this._user_info_wallet = value;
  }



}
