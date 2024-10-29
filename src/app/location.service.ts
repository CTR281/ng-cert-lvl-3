import { Injectable } from '@angular/core';
import { ZipCode } from './conditions-and-zip.type';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {
  locations: ZipCode[] = [];
  add$: Observable<ZipCode>;
  remove$: Observable<ZipCode>;
  // because we are parsing the LocalStorage during init and notify listeners that may not be listening yet,
  // ReplaySubject ensures late subscribers are notified.
  private add: ReplaySubject<ZipCode> = new ReplaySubject<ZipCode>();
  private remove: Subject<ZipCode> = new Subject<ZipCode>();

  constructor() {
    this.add$ = this.add.asObservable();
    this.remove$ = this.remove.asObservable();
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const location of this.locations) {
      this.add.next(location);
    }
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
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
