import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from './product';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'pos-product-list',
  imports: [ CommonModule ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  errorMessage: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        this.errorMessage = 'Error loading products';
        console.error(error);
      }
    });
  }

}
