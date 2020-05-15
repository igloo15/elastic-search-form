import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[es-field-host]'
})
export class EsFieldHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
