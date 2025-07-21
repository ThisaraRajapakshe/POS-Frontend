import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pos-card-wrapper',
  imports: [ CommonModule],
  templateUrl: './card-wrapper.component.html',
  styleUrl: './card-wrapper.component.scss'
})
export class CardWrapperComponent {
  @Input() width: string = '50%';
}
