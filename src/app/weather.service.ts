import { inject, Injectable, Signal, signal } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip, ZipCode } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { catchError, concatMap, filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  // The currently selected tab. Storing at the service level ensures the data is persisted when navigating out of components.
  private displayConditions = signal<ZipCode>('');
  private locationService: LocationService = inject(LocationService);
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.initSavedData();
    this.listenToLocationUpdates();
  }

  setDisplayConditions(zipcode: ZipCode) {
    this.displayConditions.update(() => zipcode);
  }

  getDisplayConditions(): Signal<ZipCode> {
    return this.displayConditions.asReadonly();
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API.
    // Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`,
    );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }

  /**
   * Retrieved weather data related to locations saved in storage. Initialization only.
   * This assumes that LocationService has already parsed the locations, which is the case since it is done
   * in its constructor, which is invoked before weatherService's since it is a dependency.
   * @private
   */
  private initSavedData() {
    const savedLocations = this.locationService.locations;
    if (!savedLocations) {
      return;
    }
    forkJoin(savedLocations.map((zipcode) => this.getWeatherData(zipcode)))
      .pipe(map((data) => data.map((value, index) => ({ zip: savedLocations[index], data: value }))))
      .subscribe((initData) => {
        this.currentConditions.update(() => initData);
      });
  }

  private getWeatherData(zipcode: ZipCode): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(
      `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`,
    );
  }

  /**
   * Init subscriptions to locations update, which will update weather data accordingly
   * @private
   */
  private listenToLocationUpdates(): void {
    this.locationService.add$
      .pipe(
        takeUntilDestroyed(),
        // when we get notified a location has been added, we fetch the related data from the API.
        // `concatMap` ensures that the data has been fetched, before moving on to the next notification.
        // switchMap may discard the ongoing request if we add another location before the response is received.
        // exhaustMap would ignore all notifications before the response is received.
        concatMap((zip) =>
          this.getWeatherData(zip).pipe(
            // because we are listening to a stream of events, any non-caught error would interrupt it.
            catchError(() => of(null)),
            filter((data) => data),
            map((data) => ({ zip, data }) as ConditionsAndZip),
          ),
        ),
      )
      .subscribe((conditionAndZip) => {
        this.currentConditions.update((conditions) => [
          { zip: conditionAndZip.zip, data: conditionAndZip.data },
          ...conditions,
        ]);
        this.displayConditions.update(() => conditionAndZip.zip);
      });

    this.locationService.remove$.pipe(takeUntilDestroyed()).subscribe((zipcode) => {
      this.currentConditions.update((conditions) => {
        for (const i in conditions) {
          if (conditions[i].zip === zipcode) {
            conditions.splice(+i, 1);
          }
        }
        return conditions;
      });
    });
  }
}
