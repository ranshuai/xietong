import { NgToggleDirective } from './ng-toggle/ng-toggle';
import { ImgCodeDirective } from './ng-img-code/ng-img-code';
import { NgModule } from '@angular/core';

import { NgShowDirective } from "./ng-show/ng-show";
import { NgEnterDirective } from "./ng-enter/ng-enter";
import { SafeHtmlDirective } from './safe-html/safe-html';
import { NgDisbledDirective } from "./ng-disabled/ng-disbled";
import { ShowPassiconDirective } from './show-passicon/show-passicon';
import { BackImgDirective } from './ng-backImg/ng-backImg';
import { MoneyFormatDirective } from './money-format/money-format';
import { Currency } from '../pipes/currency';
import { DateFormat} from '../pipes/dateFormat';
import { OrderStatusPipe } from '../pipes/orderStatus';
import {Number } from '../pipes/number';
@NgModule({
  declarations: [
    NgShowDirective,
    NgEnterDirective,
    SafeHtmlDirective,
    NgDisbledDirective,
    ShowPassiconDirective,
    BackImgDirective,
    MoneyFormatDirective,
    Currency,
    ImgCodeDirective,
    NgToggleDirective,
    DateFormat,
    OrderStatusPipe,
    Number
  ],
  exports: [
    NgShowDirective,
    NgEnterDirective,
    SafeHtmlDirective,
    NgDisbledDirective,
    ShowPassiconDirective,
    BackImgDirective,
    MoneyFormatDirective,
    Currency,
    ImgCodeDirective,
    NgToggleDirective,
    DateFormat,
    OrderStatusPipe,
    Number
  ]
})
export class DirectivesModule { }