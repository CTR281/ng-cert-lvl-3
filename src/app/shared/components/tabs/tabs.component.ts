import { Component, computed, contentChildren, output, signal } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { NgTemplateOutlet } from '@angular/common';
import { EqualPipe } from '../../pipes/equal.pipe';
import { NotPipe } from '../../pipes/not.pipe';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, EqualPipe, NotPipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  tabs = contentChildren(TabComponent);
  activeTab = computed(() => this.tabs().find((tab) => tab.active()) ?? this.tabs()[0]);
  // OPTIONAL: Whenever a tab is selected, notifies the user about its index.
  select = output<number>();

  selectTab(selectedTab: TabComponent) {
    this.activeTab().active.set(false);
    selectedTab.active.set(true);
    this.select.emit(this.tabs().indexOf(selectedTab));
  }
}
