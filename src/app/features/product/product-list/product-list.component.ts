import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../Core/services/product.service';
import { Product } from '../../../Core/models/product.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'pos-product-list',
  imports: [ CommonModule ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products$! : Observable<Product[]>; 

  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.products$ = this.productService.getAll();
  }
}
  


