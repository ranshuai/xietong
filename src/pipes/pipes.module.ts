/****公共过滤器主文件 */
import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency.pipe';
import { DateFormatPipe } from './dateFormat';
import {ParseSencondPipe } from "./parseSencond.pipe"
import { OrderByContactPipe } from './order-by-contact/order-by-contact';
import {OrderBy} from "./order-by";
import {CommonModule} from "@angular/common";
import { ChatTimePipe } from './chat-time/chat-time';
@NgModule({
  declarations: [
    CurrencyPipe,
    DateFormatPipe,
    ParseSencondPipe,
    OrderByContactPipe,
      OrderBy,
    ChatTimePipe
      ],
    imports: [
        CommonModule
    ],
  exports: [CurrencyPipe,
    DateFormatPipe,
    ParseSencondPipe,
    OrderByContactPipe,
      OrderBy,
    ChatTimePipe
      ]
})
export class PipesModule {
}
