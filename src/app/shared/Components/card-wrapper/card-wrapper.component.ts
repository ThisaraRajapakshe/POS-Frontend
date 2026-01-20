import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'pos-card-wrapper',
  imports: [ CommonModule, MatCardModule],
  templateUrl: './card-wrapper.component.html',
  styleUrl: './card-wrapper.component.scss'
})
export class CardWrapperComponent {
  @Input() width = '50%';
}
