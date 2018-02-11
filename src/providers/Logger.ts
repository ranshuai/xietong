/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import {Injectable} from '@angular/core';
import {CommonModel} from "./CommonModel";
import * as fundebug from "fundebug-javascript";

/**
 * Logger APP日志
 * @description
 */
@Injectable()
export class Logger {
  constructor(private CommonModel: CommonModel) {
  }

  log(err: any, action: string, other = null): void {
    console.log('Logger.log：action-' + action);
    other && console.log(other);
    console.log(err);
    fundebug.notifyError(err,
      {
        metaData: {
          action: action,//操作名称
          other: other,//其他数据信息
          user: {id: this.CommonModel.userId}
        }
      });
  }

  httpLog(err: any, msg: string, other = {}): void {
    console.log('Logger.httpLog：msg-' + msg);
    fundebug.notifyHttpError(err,
      {
        metaData: {
          action: msg,//操作名称
          other: other,//其他数据信息
          user: {id: this.CommonModel.userId}
        }
      });
  }

}
