import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
})
export class TabComponent {
  @Input() inputLabel = '';
  @Input() active = false;
  @ViewChild('tabLabel', { static: true }) templateLabel: TemplateRef<any>;
  @ViewChild('tabContent', { static: true }) content: TemplateRef<any>;

  toggleActive() {
    this.active = !this.active;
  }
}
