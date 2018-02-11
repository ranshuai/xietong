import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Generated class for the InputRadioGroupComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'input-radio-group',
  templateUrl: 'input-radio-group.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputRadioGroupComponent),
    multi: true
  }]
})
export class InputRadioGroupComponent {

  @Input() data: any;
  private model: any;

  constructor() { }

  public onModelChange: Function = () => { };
  public onModelTouched: Function = () => { };

  writeValue(value: any) {
    this.model = value;
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  checkRadio(item) {
    this.model = item.id;
    this.onModelChange(this.model);
  }

}
