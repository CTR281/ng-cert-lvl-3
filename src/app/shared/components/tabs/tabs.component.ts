import { Component, computed, contentChildren, signal } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { NgTemplateOutlet } from '@angular/common';
import { ComparePipe } from '../../pipes/compare.pipe';
import { NotPipe } from '../../pipes/not.pipe';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, ComparePipe, NotPipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  tabs = contentChildren(TabComponent);
  // The active tab is re-computed everytime the list of tabs is updated, or the selected tab is updated.
  // Deleting a tab updates the list of tabs; even if the deleted tab was the selected one, the active tab
  // is parsed again and falls back in this case to the first tab.
  // The problem statement does not specify if displaying nothing is valid;
  // if it is, activeTab and selectedTab can be merged.
  activeTab = computed(() => this.tabs().find((tab) => tab === this.selectedTab()) ?? this.tabs()[0]);
  selectedTab = signal<TabComponent | null>(null);

  selectTab(selectedTab: TabComponent) {
    this.selectedTab.set(selectedTab);
  }
}
