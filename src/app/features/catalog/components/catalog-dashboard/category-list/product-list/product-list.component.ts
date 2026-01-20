import { Component, EventEmitter, Input, Output, OnChanges, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../../../models';
import { ProductService } from '../../../../services';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion";
import { LineItemListComponent } from './line-item-list/line-item-list.component';

@Component({
  selector: 'pos-product-list',
  imports: [CommonModule, MatAccordion, MatExpansionPanel, MatExpansionModule, LineItemListComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnChanges {
  private productService = inject(ProductService);

  @Input() categoryId!: string;
  @Output() productSelected = new EventEmitter<string>();
  products$!: Observable<Product[]>;

  ngOnChanges() {
    if (this.categoryId) {
      this.products$ = this.productService.getByCategory(this.categoryId);
    }
  }
  selectProduct(productId: string) {
    this.productSelected.emit(productId);
  }
}
