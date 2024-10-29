import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
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
  private locationService: LocationService = inject(LocationService);
  private http: HttpClient = inject(HttpClient);

  constructor() {
    this.locationService.add$
      .pipe(
        takeUntilDestroyed(),
        // when we get notified a location has been added, we fetch the related data from the API.
        // `concatMap` ensures that the data has been fetched, before moving on to the next notification.
        // switchMap may discard the ongoing request if we add another location before the response is received.
        // exhaustMap would ignore all notifications before the response is received.
        concatMap((zipcode) =>
          this.http
            .get<CurrentConditions>(
              `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`,
            )
            .pipe(
              // because we are listening to a stream of events, any non-caught error would interrupt it.
              catchError(() => of(null)),
              filter((data) => data),
              map((data) => [zipcode, data] as [string, CurrentConditions]),
            ),
        ),
      )
      .subscribe(([zipcode, data]) =>
        this.currentConditions.update((conditions) => [...conditions, { zip: zipcode, data }]),
      );

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
}
