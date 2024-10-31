import { Component, inject, Signal } from '@angular/core';
import { WeatherService } from '../weather.service';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { ConditionsAndZip } from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
})
export class CurrentConditionsComponent {
  protected weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();
  private router = inject(Router);

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  close(location: ConditionsAndZip): void {
    this.locationService.removeLocation(location.zip);
  }

  /**
   * Set the location currently displayed.
   * Called whenever the selected tab is updated.
   * @param index
   */
  saveActiveLocation(index: number) {
    this.locationService.activeLocation.set(this.currentConditionsByZip()[index].zip);
  }
}
