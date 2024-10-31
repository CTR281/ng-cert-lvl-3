import { Component, input, model, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
})
export class TabComponent {
  inputLabel = input();
  templateLabel = viewChild<TemplateRef<any>>('tabLabel');
  content = viewChild<TemplateRef<any>>('tabContent');
  // OPTIONAL: Can be used as an input to force a tab to be active.
  // For example: when a new tab is added, by default the selected tab does not change,
  // while the consumer may want to display the new tab.
  active = model<boolean>(false);
}
