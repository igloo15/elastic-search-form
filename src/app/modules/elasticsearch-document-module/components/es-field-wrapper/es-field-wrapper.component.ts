import { Component, OnInit, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { ESFieldConfig, ESFieldComponent } from '../../models/field-data';
import { EsFieldHostDirective } from '../es-field-host.directive';

@Component({
  selector: 'es-field-wrapper',
  templateUrl: './es-field-wrapper.component.html',
  styleUrls: ['./es-field-wrapper.component.scss']
})
export class EsFieldWrapperComponent implements OnInit {

  @Input() config: ESFieldConfig;
  @ViewChild(EsFieldHostDirective, {static: true}) esHost: EsFieldHostDirective;


  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    if(this.config) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.template);
      const componentRef = this.esHost.viewContainerRef.createComponent(componentFactory);
      const tempField = componentRef.instance as ESFieldComponent;
      if (tempField) {
        tempField.data = this.config.data;
      } else {
        console.error(`Component ${this.config.data.config.type} does not exist`);
      }
    }
  }

}
