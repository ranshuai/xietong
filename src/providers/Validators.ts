/**
 * Created by 61538187@qq.com on 2017/12/02.
 */
import { Injectable } from "@angular/core";
import { Validators as angularValidators, AbstractControl } from '@angular/forms';

@Injectable()
export class Validators extends angularValidators {

  /*E-mail*/
  static email = function (control: AbstractControl) {
    return Validators.validatorsByPattern('email', control, '[a-z]([a-z0-9]*[-_]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?');
  };

  /*手机号码*/
  static phone = function (control: AbstractControl) {
    return Validators.validatorsByPattern('phone', control, '1[0-9]{10,10}');
  };

  /*中文*/
  static chinese = function (control: AbstractControl) {
    return Validators.validatorsByPattern('chinese', control, '[(\u4e00-\u9fa5)]+');
  };

  /*中文、数字、英文、下划线 */
  static blend = function (control: AbstractControl) {
    return Validators.validatorsByPattern('blend', control, '[(\u4e00-\u9fa5)]|[A-Za-z0-9_]+');
  };
  
  /* 数字 */
  static number = function (control: AbstractControl) {
    return Validators.validatorsByPattern('number', control, '^[0-9]$');
  };

  /*英文、数字包括下划线*/
  static legallyNamed = function (control: AbstractControl) {
    return Validators.validatorsByPattern('legallyNamed', control, '[A-Za-z0-9_]+');
  };

  /*金额正整数*/
  static money = function (control: AbstractControl) {
    return Validators.validatorsByPattern('money', control, '^[0-9]*[1-9][0-9]*$');
  }

  /*金额小数点*/
  static moneyTrue = function (control: AbstractControl) {
    return Validators.validatorsByPattern('moneyTrue', control, '(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)');
  }

  /*身份证*/
  static idcard = function (control: AbstractControl) {
    return Validators.validatorsByPattern('idcard', control, '(^[1-9][0-9]{14}$)|(^[1-9][0-9]{17}$)|(^[1-9][0-9]{16}(\d|X|x)$)');
  }

  /*最大值30*/
  static max30 = function (control: AbstractControl) {
    return Validators.validatorsByPattern('max30', control, '^([0-2]?[0-9]|30)$');
  }

  private static validatorsByPattern = function (name: string, control: AbstractControl, pattern: string) {
    let validatorFn = Validators.pattern(pattern)(control);
    if (validatorFn != null) {
      validatorFn[name] = validatorFn['pattern'];
    }
    return validatorFn;
  };
}
