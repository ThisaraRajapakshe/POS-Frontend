import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pos-product-line-item-create',
  imports: [],
  templateUrl: './product-line-item-create.component.html',
  styleUrl: './product-line-item-create.component.scss'
})
export class ProductLineItemCreateComponent {
  productLineItemForm!: FormGroup;
  submissionError: boolean = false;
  message: string = '';

  
}
