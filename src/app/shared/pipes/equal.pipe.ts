import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'equal',
  standalone: true,
})
export class EqualPipe implements PipeTransform {
  transform<T>(a: T, b: T): boolean {
    return a === b;
  }
}
