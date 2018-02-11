import { Config } from './../../../../gouxiangke/providers/api/config.model';
import { Api } from './../../../../gouxiangke/providers/api/api';
import { Component, Input} from '@angular/core';
import { ThirdPartyApiProvider } from "../../../../gouxiangke/providers/third-party-api/third-party-api";
import { CommonProvider } from "../../../../gouxiangke/providers/common/common";



@Component({
  selector: 'store-info-init',
  templateUrl: 'store-info-init.html',
})

export class StoreInfoInit{
  @Input() private data: any;
  type: any;
  imgData = {
    "storeFront": '', //背景
    "logo":'' //logo
  };
  constructor(
    public thirdPartyApi: ThirdPartyApiProvider,
    public api: Api,
    public config: Config,
    public common:CommonProvider
  ) {}

  ngOnInit() {
  }

    //图片选中上传
    fileChange(file) { 
      this.thirdPartyApi.uploadImage(file.target.files[0], 'user').subscribe(data => { 
        if (data) { 
          let _data = data
          this.imgData[this.type] = data;
            let json = {
              companyInfoId: window.localStorage.storeId,
              headPic: this.imgData['logo'] || this.data['logo'] || '',
              unitBackground: this.imgData['storeFront'] || this.data['storeFront'] || '',
            }
          //保存图片  
          let url = this.api.config.host.org+'v2/check/updateStoreInfo';
          this.api.get(url, json).subscribe((data) => {
            if (data.success) {
              console.log(data);
              this.data[this.type] = _data;
            } else { 
              this.common.tostMsg({msg:data.msg})
            }
          })
  
          }
        })
      }
  //上传图片
  addImg(str) {
    this.type = str;
    console.log(document.getElementById("imgUpdate"));
    document.getElementById("imgUpdate").click();
  }
}
