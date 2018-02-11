import { Directive, ElementRef, Input, Sanitizer, SecurityContext, SimpleChanges } from '@angular/core';

/**
 * Generated class for the SafeHtmlDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
  selector: '[safeHtml]' // Attribute selector
})
export class SafeHtmlDirective {

  @Input() safeHtml;

  constructor(private element: ElementRef, private sanitizer: Sanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    let div = document.createElement('div');
    div.innerHTML = this.safeHtml;
    if ('safeHtml' in changes) {
      this.element.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, div.innerHTML);
      // this.element.nativeElement.innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, div.textContent);
    }
  }

}
