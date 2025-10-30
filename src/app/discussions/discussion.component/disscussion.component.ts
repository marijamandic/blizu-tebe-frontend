import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-disscussion.component',
  standalone: true,
  imports: [],
  template: `<p>disscussion.component works!</p>`,
  styleUrls: ['./discussion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisscussionComponent { }
