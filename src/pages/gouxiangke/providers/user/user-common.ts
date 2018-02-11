import { Config } from './../api/config.model';
import { CommonProvider } from './../common/common';
import { Api } from './../api/api';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { RequestOptions, Headers } from '@angular/http';
/*!
 *
  消费者 common 模块 v1.0.0 （2017-12-12）
 *
  Copyright 冉帅 
 *
  Include APi，CommonProvider
 */

@Injectable()
export class UserCommon { 

  constructor(public api: Api,public commonProvider:CommonProvider,public config:Config) { 

  }
  /**
  *
  方法说明
    成为会员
	*
	@method setBecomemMember
	*
  @param {param:{}callback:fn()} 参数名 参数说明 
    param : 需要的参数
		callback : 回调函数
	*
	@return null 返回值说明
	*/
  setBecomemMember(json): void { 
    let headers = new Headers({ storeId: json.param.storeId }); 
    let options = new RequestOptions({ headers: headers })
    this.api.post(this.api.config.host.bl + 'v2/customer/addUserLevelInfo', '', options).subscribe(data => { 
      console.log(data);
      if (data.success) {
        //成功以后不需要提示用户
       }
      else { 
        // this.commonProvider.tostMsg({msg:data.msg})
        
      }
    });
    

  }

  /**
  *
  方法说明
    知识共享是否显示
    只有购享客才会显示知识
	*
	@method getKnowledgeTab
	*
  @param {space:'',callback:fn()} 参数名 参数说明 
    param : 需要的参数
		callback : 回调函数
	*
	@return boolean 返回值说明
	*/
  getKnowledgeTab(json):boolean { 
    let b;
    let space;
    if (json.space == '92E21DE17C0CE872') {
      b = true
    } else {
      b = false;
     }
    return b
  }
  /**
  *
  方法说明
    获取客服列表
	*
	@method getServicelist
	*
  @param {space:'',callback:fn()} 参数名 参数说明 
    param : 需要的参数
		callback : 回调函数
	*
	@return arr 返回值说明
  */
  
  getServiceList(storeId?) { 
    return new Observable((observer: Subscriber<any>) => { 
      let options: any;
      if (this.config.PLATFORM == 'STOREAPPWX' || this.config.PLATFORM == 'STOREAPP') { 
        options = ''
      }
      if (this.config.PLATFORM == 'WX' || this.config.PLATFORM == 'APP') {
        let headers = new Headers({ storeId: storeId}); 
        options = new RequestOptions({ headers: headers })
       }
      this.api.get(this.api.config.host.org + 'company/customer/queryCustomers', '', options).subscribe(data => { 
        if (data.success) {
          observer.next(data);
        } else { 
          this.commonProvider.tostMsg({msg:data.msg})
        }
      })
    })
    
    
  }

}

