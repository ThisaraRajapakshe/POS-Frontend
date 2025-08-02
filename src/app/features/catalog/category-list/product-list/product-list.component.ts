import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { Product } from '../../../../Core/models/Domains/product.model';
import { ProductService } from '../../../../Core/services/product.service';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from "@angular/material/expansion";
import { LineItemListComponent } from './line-item-list/line-item-list.component';

@Component({
  selector: 'pos-product-list',
  imports: [CommonModule, MatAccordion, MatExpansionPanel, MatExpansionModule, LineItemListComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  @Input() categoryId!: string;
  @Output() productSelected = new EventEmitter<string>();
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) { }

  ngOnChanges() {
    if (this.categoryId) {
      this.products$ = this.productService.getByCategory(this.categoryId);
    }
  }
  selectProduct(productId: string) {
    this.productSelected.emit(productId);
  }
}
