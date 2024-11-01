import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './zipcode-entry/zipcode-entry.component';
import { LocationService } from './location.service';
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import { WeatherService } from './weather.service';
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule } from '@angular/router';
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TabsComponent } from './shared/components/tabs/tabs.component';
import { TabComponent } from './shared/components/tabs/tab/tab.component';
import { EqualPipe } from './shared/pipes/equal.pipe';
import { NotPipe } from './shared/pipes/not.pipe';
import { provideCacheInterceptor } from './core/services/cache-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    TabsComponent,
    TabComponent,
    EqualPipe,
    NotPipe,
  ],
  providers: [
    LocationService,
    WeatherService,
    provideCacheInterceptor({
      ttl: 7200000,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
