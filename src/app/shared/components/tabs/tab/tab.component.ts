import { Component, input, TemplateRef, viewChild } from '@angular/core';

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
}
