import { Component, Input } from '@angular/core';
import { ProductLineItemService } from '../../../../../Core/services/product-line-item.service';
import { Observable } from 'rxjs/internal/Observable';
import { ProductLineItem } from '../../../../../Core/models/Domains/product-line-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pos-line-item-list',
  imports: [CommonModule],
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
