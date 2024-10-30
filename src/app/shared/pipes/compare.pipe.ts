import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compare',
  standalone: true,
})
export class ComparePipe implements PipeTransform {
  transform<T>(a: T, b: T): boolean {
    return a === b;
  }
}
