import { Component, Input } from '@angular/core';
import { ProductLineItemService } from '../../../../../services';
import { Observable } from 'rxjs/internal/Observable';
import { ProductLineItem } from '../../../../../models';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'pos-line-item-list',
  imports: [CommonModule, MatTableModule],
  templateUrl: './line-item-list.component.html',
  styleUrl: './line-item-list.component.scss'
})
export class LineItemListComponent {
  @Input() productId!: string;
  lineItems$!: Observable<ProductLineItem[]>;

  constructor(private lineItemService: ProductLineItemService) { }

  ngOnChanges(): void {
    if (this.productId) {
      this.lineItems$ = this.lineItemService.getByProduct(this.productId);
    }
  }

}
