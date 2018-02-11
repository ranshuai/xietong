/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import {Injectable} from "@angular/core";
import {ToastController, LoadingController, Platform, Loading, AlertController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {AppVersion} from "@ionic-native/app-version";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {Toast} from "@ionic-native/toast";
import {File, FileEntry} from "@ionic-native/file";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ImagePicker} from "@ionic-native/image-picker";
import {Network} from "@ionic-native/network";
import {AppMinimize} from "@ionic-native/app-minimize";
import {CallNumber} from "@ionic-native/call-number";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { Device } from '@ionic-native/device';
import {
  IMAGE_SIZE,
  QUALITY_SIZE,
  REQUEST_TIMEOUT
} from "./Constants";
import {CommonModel} from "./CommonModel";
import { Observable } from "rxjs";
import { Subscriber } from 'rxjs/Subscriber';
import {Logger} from "./Logger";
import {Utils} from "./Utils";
import { Diagnostic } from "@ionic-native/diagnostic";
import { HttpConfig} from "./HttpConfig";
declare var Media: any;
declare var Wechat: any;
@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;
  media;//当前播放的音频对象
  constructor(private platform: Platform,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
              private appVersion: AppVersion,
              private camera: Camera,
              private toast: Toast,
              private transfer: FileTransfer,
              private file: File,
              private inAppBrowser: InAppBrowser,
              private imagePicker: ImagePicker,
              private network: Network,
              private appMinimize: AppMinimize,
              private cn: CallNumber,
              private barcodeScanner: BarcodeScanner,
              private loadingCtrl: LoadingController,
              private CommonModel: CommonModel,
              public logger: Logger,
              private diagnostic: Diagnostic,
    private device: Device,
    private fileOpener: FileOpener,
              private utils: Utils,
              private httpConfig:HttpConfig
              ) {
  }


  /**
   * 显示状态栏
   */
  showStatusBar(): void {
    if (this.isMobile()) {
        this.statusBar.show();
    }
  }
  /**
   * 状态栏
   */
  statusBarStyle(): void {
    if (this.isMobile()) {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
      // this.statusBar.backgroundColorByHexString('#488aff');
    }
  }

  /**
   * 隐藏启动页面
   */
  splashScreenHide(): void {
    this.isMobile() && this.splashScreen.hide();
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 调用最小化app插件
   */
  minimize(): void {
    this.appMinimize.minimize()
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

 
  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  alert(title: string, subTitle: string = "",): void {
    this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [{text: '确定'}],
      enableBackdropDismiss: false
    }).present();
  }

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  };

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.CommonModel.showLoading) {
      return;
    }
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, REQUEST_TIMEOUT);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    if (!this.CommonModel.showLoading) {
      this.CommonModel.showLoading = true;
    }
    if (this.loadingIsOpen) {
      setTimeout(() => {
        this.loading.dismiss();
        this.loadingIsOpen = false;
      }, 200);
    }
  };

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.DATA_URL,//默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: QUALITY_SIZE,//图像质量，范围为0 - 100
      allowEdit: false,//选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: IMAGE_SIZE,//缩放图像的宽度（像素）
      targetHeight: IMAGE_SIZE,//缩放图像的高度（像素）
      saveToPhotoAlbum: false,//是否保存到相册
      correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
    }, options);
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    let that = this;
    let ops = Object.assign({
      maximumImagesCount: 6,
      width: IMAGE_SIZE,//缩放图像的宽度（像素）
      height: IMAGE_SIZE,//缩放图像的高度（像素）
      quality: QUALITY_SIZE//图像质量，范围为0 - 100
    }, options);
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        let destinationType = options['destinationType'] || 0;//0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          let imgBase64s = [];//base64字符串数组
          for (let fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            })
          }
        }
      }).catch(err => {
        this.logger.log(err, '通过图库选择多图失败');
        this.alert('获取照片失败');
      });
    });
  };

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          let reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
      });
    });
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app版本号失败');
      });
    });
  }

  /**
   * 获得app name,如现场作业
   * @description  对应/config.xml中name的值
   */
  getAppName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getAppName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app name失败');
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        this.logger.log(err, '获得app包名失败');
      });
    });
  }

  /**
   * 拨打电话
   * @param number
   */
  callNumber(number: string): void {
    this.cn.callNumber(number, true)
      .then(() => console.log('成功拨打电话:' + number))
      .catch(err => this.logger.log(err, '拨打电话失败'));
  }

    /**
     * 扫描二维码 http://ionicframework.com/docs/native/barcode-scanner/
     */

    OpenBarcodeScanner() {
        return Observable.create((observer: Subscriber<any>) => {
            this.barcodeScanner.scan().then((barcodeData) => {
                observer.next(barcodeData);
            }, (err) => {
                // An error occurred
                observer.next(err);
            });
        })
    }
 
  
  
  
  
    

  //检测app位置服务是否开启
  private assertLocationService = (() => {
    let enabledLocationService = false;//手机是否开启位置服务
    return () => {
      return Observable.create(observer => {
        if (enabledLocationService) {
          observer.next(true);
        } else {
          this.diagnostic.isLocationEnabled().then(enabled => {
            if (enabled) {
              enabledLocationService = true;
              observer.next(true);
            } else {
              enabledLocationService = false;
              this.alertCtrl.create({
                title: '您未开启位置服务',
                subTitle: '正在获取位置信息',
                buttons: [{text: '取消'},
                  {
                    text: '去开启',
                    handler: () => {
                      this.diagnostic.switchToLocationSettings();
                    }
                  }
                ]
              }).present();
            }
          }).catch(err => {
            this.logger.log(err, '调用diagnostic.isLocationEnabled方法失败');
          });
        }
      });
    };
  })();

  //检测app是否有定位权限
  private assertLocationAuthorization = (() => {
    let locationAuthorization = false;
    return () => {
      return Observable.create(observer => {
        if (locationAuthorization) {
          observer.next(true);
        } else {
          this.diagnostic.isLocationAuthorized().then(res => {
            if (res) {
              locationAuthorization = true;
              observer.next(true);
            } else {
              locationAuthorization = false;
              this.diagnostic.requestLocationAuthorization('always').then(res => {//请求定位权限
                if (res == 'DENIED_ALWAYS') {//拒绝访问状态,必须手动开启
                  locationAuthorization = false;
                  this.alertCtrl.create({
                    title: '缺少定位权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                } else {
                  locationAuthorization = true;
                  observer.next(true);
                }
              }).catch(err => {
                this.logger.log(err, '调用diagnostic.requestLocationAuthorization方法失败');
              });
            }
          }).catch(err => {
            this.logger.log(err, '调用diagnostic.isLocationAvailable方法失败');
          });
        }
      });
    };
  })();

  //检测app是否有读取存储权限
  private externalStoragePermissionsAuthorization = (() => {
    let havePermission = false;
    return () => {
      return Observable.create(observer => {
        if (havePermission) {
          observer.next(true);
        } else {
          let permissions = [this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
          this.diagnostic.getPermissionsAuthorizationStatus(permissions).then(res => {
            if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
              havePermission = true;
              observer.next(true);
            } else {
              havePermission = false;
              this.diagnostic.requestRuntimePermissions(permissions).then(res => {//请求权限
                if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                  havePermission = true;
                  observer.next(true);
                } else {
                  havePermission = false;
                  this.alertCtrl.create({
                    title: '缺少读取存储权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                }
              }).catch(err => {
                this.logger.log(err, '调用diagnostic.requestRuntimePermissions方法失败');
              });
            }
          }).catch(err => {
            this.logger.log(err, '调用diagnostic.getPermissionsAuthorizationStatus方法失败');
          });
        }
      });
    };
  })();

  

    /**
   * 
   * @param type 平台信息  平台类型 Android 1 或者Ios 2
   * @param isForce 是否是强制更新     0否  1是
   * @param fileName 文件名称 
   * @param downloadUrl  连接地址
   */
  
  downloadApp(type, isForce, fileName, downloadUrl): void {
  
    if (type==2) { 

    }

    if (type == 1) {
            //     this.fileOpener.open(this.file.externalRootDirectory + 'download/'+fileName, 'application/vnd.android.package-archive')
            //         .then(() => { })
            //         .catch(e => { });    
            // }, error => { 

        // this.file.checkFile(this.file.externalRootDirectory + 'download/', fileName).then(() => { 
        //     this.fileOpener.open(this.file.externalRootDirectory + 'download/'+fileName, 'application/vnd.android.package-archive')
        //         .then(() => { })
        //         .catch(e => { });    
        // }, error => { 
            this.externalStoragePermissionsAuthorization().subscribe(() => {
                let backgroundProcess = false;//是否后台下载
                let alert;
                let timer = null;//由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
                if (isForce == 1) {
                    alert = this.alertCtrl.create({//显示下载进度
                        title: '下载进度：0%',
                        enableBackdropDismiss: false
                    });
                } else { 
                    alert = this.alertCtrl.create({//显示下载进度
                        title: '下载进度：0%',
                        enableBackdropDismiss: false,
                        buttons: [{
                          text: '后台下载', handler: () => {
                            backgroundProcess = true;
                          }
                        }
                        ]
                      });  
                }  
                alert.present();
                const fileTransfer: FileTransferObject = this.transfer.create();

                const newfileName = fileName + new Date().getTime() + '.apk';

                const apk = this.file.externalRootDirectory + 'download/' +newfileName; //apk保存的目录
                //下载并安装apk
                fileTransfer.download(downloadUrl, apk).then(() => {
                    clearTimeout(timer);
                    if (isForce == 0) { 
                        alert.dismiss();
                    } else {
                        let title = document.getElementsByClassName('alert-title')[0];
                        title && (title.innerHTML = `下载完成`);
                    }
                    this.fileOpener.open(this.file.externalRootDirectory + 'download/'+newfileName, 'application/vnd.android.package-archive')
                        .then(() => { 
                        console.log('打开成功')
                    })
                        .catch(e => { 
                        console.log(e)
                    });   
                }, err => {
                    this.showToast('本地安装失败')
                });
      
                fileTransfer.onProgress((event: ProgressEvent) => {
                    let progress = Math.floor(event.loaded / event.total * 100);//下载进度
                    if (!backgroundProcess) {
                        if (progress === 100) {
                            if (isForce == 0) { 
                                alert.dismiss();
                            } else {
                                let title = document.getElementsByClassName('alert-title')[0];
                                title && (title.innerHTML = `下载完成`);
                            }
                        } else {
                            if (!timer) {
                                timer = setTimeout(() => {
                                    clearTimeout(timer);
                                    timer = null;
                                    let title = document.getElementsByClassName('alert-title')[0];
                                    title && (title.innerHTML = `下载进度：${progress}%`);
                                }, 1000);
                            }
                        }
                    }
                });
            });  
        // })
    }
}


 /**
     * 开始录音
     */
    recordStart(second) {
      return Observable.create((observer: Subscriber<any>) => {
          (<any>window).plugins.audioRecorderAPI.record(msg => {
              observer.next(msg);
          }, error => {
              observer.next(error);
          },second); 
      })
  }


  /**
   * 结束录音 返回文件
   */
  recordEnd() {
      return Observable.create((observer: Subscriber<any>) => {
          (<any>window).plugins.audioRecorderAPI.stop(file => {
              observer.next(file);
          })
      })
  }


  /**
   * 音频播放  https://github.com/apache/cordova-plugin-media
   * @param filePath
   */
  MediaPlay(filePath) {
      return Observable.create((observer: Subscriber<any>) => {
          this.media = new Media('file:///' + filePath, data => {
              console.log("playAudio():Audio Success");
          }, error => {
              console.log("playAudio():Audio error");
          });
          this.media.play();
      })
  }



/**
 * 微信登录
 */
WechatLogin() {
  return Observable.create((observer: Subscriber<any>) => {
      Wechat.auth("snsapi_userinfo", response => {
          observer.next(response);
      }, error => {
          observer.next(error);
      });
  })
}



/**
* 
* @param payObj 微信统一下单支付对象   支付类型APP
*/
wechatPay(payObj) { 
  return Observable.create((observer: Subscriber<any>) => {
      Wechat.sendPaymentRequest(payObj, result => {
          observer.next({error:false});
      }, error => {
          observer.next({error:true});
      });
  })
}


/**
* 微信分享
* @param obj 
*/    
wechatShare(obj) { 
  this.utils.openModal('SexSelectModal',{
    list:["分享至微信朋友圈","分享给微信好友"]
  }, {},true).subscribe(data=>{
      if(data){
          if (data.item == '分享至微信朋友圈') {
              Wechat.share({
                  message: {
                      title:'会计智囊',
                      description:obj.title,
                      thumb: obj.bannerUrl,
                      media: {
                          type: Wechat.Type.LINK,
                          webpageUrl:'http://kjzn.snsall.com/#/download'
                      }
                  },
                      scene: Wechat.Scene.TIMELINE   // share to Timeline
                  }, function () {
                     this.toastService.show('分享成功','bottom',4000);
                  }, function (reason) {
                      console.log("Failed: " + reason);
                  });
          }else if(data.item == '分享给微信好友') {
              Wechat.share({
                  message: {
                      title: '会计智囊',
                      description: obj.title,
                      thumb: obj.bannerUrl,
                      media: {
                          type: Wechat.Type.LINK,
                          webpageUrl:'http://kjzn.snsall.com/#/download'
                      }
                  },
                      scene: 0  // share to Timeline
                  }, function () {
                     this.toastService.show('分享成功','bottom',4000);
                  }, function (reason) {
                      console.log("Failed: " + reason);
                  });
          }
        
      }
  })
}



    /**
     *  文件上传
     * @param filePath 文件路径
     * @param type 文件类型
     * 功能名称 (用户:user;身份资质:identify;默认:default;音频:sound)
     */
    fileUpLoad(filePath, type = 'sound') {
      return Observable.create((observer: Subscriber<any>) => {
          let options: FileUploadOptions = {
              fileKey: "file",
              fileName: filePath.substr(filePath.lastIndexOf("/") + 1),
              headers: {
                  userId: '1961',
                  space: "21A4A35DE3403C5B"
              },
              httpMethod: 'POST',
              params: {
                  type: type
              }
          };
          const ft: FileTransferObject = this.transfer.create();
          ft.upload(filePath, encodeURI(this.httpConfig.host.bl + this.httpConfig.version + 'upload/picture'), options).then(data => {
              // JSON.parse(data.response);
              observer.next(JSON.parse(data.response));
          }, error => {
              observer.next({ msg: '上传失败', success: false, error: error });
          })
      })
  }


  
/**
 * 打开手机设置
 */
openSeting() { 
  this.diagnostic.switchToSettings();
}  

   /**
     * 获取本机设备号
     */
    getUUId() { 
      if (this.isMobile()) {
          return this.device.uuid;
      } else { 
          return this.getWebUUID();
      }
  }

  /**
   * 获取webUUID
   */
  getWebUUID() {
    var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var n = 5, s = "";
    for (var i = 0; i < n; i++) {
        var rand = Math.floor(Math.random() * str.length);
        s += str.charAt(rand);
    }
    return s + (new Date().getTime());
}

  

}
