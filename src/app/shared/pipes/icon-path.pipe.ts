import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appIconPath',
})
export class IconPathPipe implements PipeTransform {

  transform(value: string): string {
    return `assets/icons/${value}.svg`;
  }

}
