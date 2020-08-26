import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deCamelCase'
})
export class DeCamelCasePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/([A-Z])/g, match => ` ${match}`).replace(/^./, match => match.toUpperCase());;
  }

}
