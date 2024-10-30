import {
  AfterContentInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  inject,
  Output,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { NgTemplateOutlet } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ComparePipe } from '../../pipes/compare.pipe';
import { NotPipe } from '../../pipes/not.pipe';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgTemplateOutlet, ComparePipe, NotPipe],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent implements AfterContentInit {
  @Output() onSelectTab: EventEmitter<number> = new EventEmitter<number>();
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  activeTab: TabComponent;

  private destroyRef: DestroyRef = inject(DestroyRef);

  ngAfterContentInit() {
    this.activeTab = this.findActiveTab();
    this.tabs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.activeTab = this.findActiveTab();
    });
  }

  selectTab(tab: TabComponent) {
    this.activeTab.toggleActive();
    tab.toggleActive();
    this.activeTab = tab;
    this.onSelectTab.emit(this.tabs.toArray().findIndex((tab) => tab === this.activeTab));
  }

  private findActiveTab(): TabComponent {
    return this.tabs.find((tab) => tab.active) ?? this.tabs.first;
  }
}
