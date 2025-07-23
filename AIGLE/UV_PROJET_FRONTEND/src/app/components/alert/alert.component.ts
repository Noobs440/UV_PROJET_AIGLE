import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() message: string = '';
  @Input() show: boolean = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.show = false;
    this.closed.emit();
  }
}
