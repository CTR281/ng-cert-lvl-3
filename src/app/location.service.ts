import { Injectable } from '@angular/core';
import { ZipCode } from './conditions-and-zip.type';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {
  locations: ZipCode[] = [];
  add$: Observable<ZipCode>;
  remove$: Observable<ZipCode>;
  private add: Subject<ZipCode> = new Subject<ZipCode>();
  private remove: Subject<ZipCode> = new Subject<ZipCode>();

  constructor() {
    this.add$ = this.add.asObservable();
    this.remove$ = this.remove.asObservable();
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
  }

  addLocation(zipcode: string) {
    if (this.locations.find((location) => location === zipcode)) {
      return;
    }
    this.locations.unshift(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    this.add.next(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.remove.next(zipcode);
    }
  }
}
