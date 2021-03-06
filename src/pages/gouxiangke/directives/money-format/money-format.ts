import { Directive, ElementRef, Input } from '@angular/core';

/**
 * Generated class for the NgShowDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[moneyFormat]' // Attribute selector
})
export class MoneyFormatDirective {

  @Input() moneyFormat: any;

  element: ElementRef;

  constructor(element: ElementRef) {
    this.element = element;
  }

  ngOnChanges(changes) {
    let number = changes.moneyFormat.currentValue;
    this.element.nativeElement.innerHTML = this.formatMoney(number);
  }


    //金钱格式化
  formatMoney(number, places?, symbol?, thousand?, decimal?) {
      number = number || 0;
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "￥";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var negative = number < 0 ? "-" : "",
          i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
          j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number -parseFloat(i)).toFixed(places).slice(2) : "");
  }
}
