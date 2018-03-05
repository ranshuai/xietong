export class HttpConfig {

  /***请求头部信息  决定着打包是域还是店铺 和跳转页面开始*/ 
  space:string;//域或店铺的appkey    会通过mainCtrl中setPlatfrom()自动设置
  clientType:string;//'1'是域 '2'是店铺  会通过mainCtrl中setPlatfrom()自动设置
  storeId:any;//如果是店铺 传店铺id  会通过mainCtrl中setPlatfrom()自动设置
  platform='';//'android  ios  web wx' 会通过mainCtrl自动设置
  uuid = '';  //设备id   会通过mainCtrl中setPlatfrom()自动设置
  /***请求头部信息  决定着打包是域还是店铺 和跳转页面结束*/
  
  /******如果是店铺*******/
    // space = '92E21DE17C0CE872';
    // clientType='2';//1是域 2是店铺   
    // storeId='1415';//如果是店铺 传店铺id  
  /*************/
  /******如果是域商城*******/
  // space = 'DF4D69929FD7F405';
  // clientType='1';//1是域 2是店铺   
  // storeId='';//如果是店铺 传店铺id  
  /*************/   
  openId: string;//当前用户的Openid
  hostList = {
      //开发环境
      dev: {
          bl: 'http://d.b.snsall.com/',
          lg: 'http://d.l.snsall.com/',
          org: 'http://d.o.snsall.com/'
      },
      //测试环境
      test: {
          bl: 'https://t.b.snsall.com/',
          lg: 'https://t.l.snsall.com/',
          org: 'https://t.o.snsall.com/'
      },
      prod: {
          bl: 'https://b.snsall.com/',
          lg: 'https://l.snsall.com/',
          org: 'https://o.snsall.com/'
        }
  };
    isMsgShow=false;
  //测试环境,会根据headers中的数据，来切换
  host:any;
    baseUrl= window.localStorage.getItem("currentHost");
    // baseUrl="http://wow.snsall.com";//独角鲸微信需要用到

  /********接口名称 调用方法最好和此明明一样 方便后期搜索******/
  version = '/';
  
  /*******************页面地址URL配置*****************************/
    APP_PAGE_CONFIG = {
        "default": {
            ionicPage: "TabMenuPage",
            data: null
        },
        "brainpower-tabs": {
            isRoot: true,
            root: '',
            ionicPage: 'BrainpowerTabsPage'
        },
        "special-detail": {
            isRoot: false,
            ionicPage: 'SpecialDetailPage',
            root: 'BrainpowerTabsPage',
            key: ['id', 'price']
        },
        "goods_detail": {
            isRoot: false,
            ionicPage: 'GoodsDetailPage',
            root: 'TabMenuPage',
            key: ['goods_id']
        },
        "confirmCompany": {
            isRoot: true,
            ionicPage: 'ConfirmCompanyPage',
            root: '',
            key: ['company_name', 'company_id']
        },
        "open_store": {
            isRoot: true,
            root: '',
            ionicPage: 'ApplyRolePage'
        },
        "recruit_downlines": {
            isRoot: true,
            ionicPage: 'RecuritDownlinePage',
            root: ' ',
            key: ['recruitUserId']
        },
        "apply_role": {
            isRoot: true,
            ionicPage: 'ApplyRolePage',
            root: ' ',
            key: ['recruitUserId']
        },
        "store_claim": {
            isRoot: true,
            ionicPage: 'StoreClaimPage',
        },
        "store": {
            isRoot: false,
            ionicPage: 'StoreDetailPage',
            root: 'TabMenuPage',
            key: ['store_id']
        }
    }  
  
  //购物车的角标是否显示
  isShopTabBadge = false;
  //购物车的数量
  shopCarNum: any;
  //第三方授权信息
  thirdPartyAuthorization: any = {};
  source: String;
  //开启启动页
  isGuide: Boolean = true;                                     
  LINK: string = this.isGuide ? 'GuidePage' : 'UserPage';
  //此参数用来判断，进入订单时，是立即购买的订单还是购物车订单
  isNowBuy: Boolean = false;
  //此参数用来判断，进入订单时，是是否拼团
  isGroupBuy: Boolean = false;
  //此参数用来控制是否隐藏用户界面的tabs
  hideUserTabs: Boolean = false;
  //此参数用来判断，点击地址列表的时候，是否需要选择地址，并返回订单详情
  needSelectAddress: Boolean = true;
  //tab的颜色:1是红色2是蓝色
  tabColor: number;
  //用来传递店铺订单中几个切换的搜索单号
  orderSn: string;
  //用来传递添加店铺商品时的数据
  storeGoodsForm: any;
  //用来传递编辑店铺商品时的数据
  editStoreGoods: any;
  //用来锁定确认下单的字段
  lockOrderBtn: Boolean = false;
  //pc后台的配置信息
  platformsetSelectConfigInfo: any;
  
    
  
    



}