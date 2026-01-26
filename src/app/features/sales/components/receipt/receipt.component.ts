import { Component, Input } from '@angular/core';
import { Order } from '../../models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pos-receipt',
  imports: [CommonModule],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {
  @Input() orderData: Order | null = null
}
