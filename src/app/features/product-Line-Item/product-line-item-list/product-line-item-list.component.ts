import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductLineItem } from '../../../Core/models/Domains/product-line-item.model';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pos-product-line-item-list',
  imports: [CommonModule],
  templateUrl: './product-line-item-list.component.html',
  styleUrl: './product-line-item-list.component.scss'
})
export class ProductLineItemListComponent implements OnInit {
    productLineItems$!: Observable<ProductLineItem[]>;
    
    constructor(private productLineItemService: ProductLineItemService) { }

    ngOnInit(): void {
        this.productLineItems$ = this.productLineItemService.getAll();
    } 
}
