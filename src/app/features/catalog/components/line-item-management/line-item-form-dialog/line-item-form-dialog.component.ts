
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from './../../../services';
import { Product } from './../../../models';

@Component({
  selector: 'pos-line-item-form-dialog',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './line-item-form-dialog.component.html',
  styleUrl: './line-item-form-dialog.component.scss'
})
export class LineItemFormDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<LineItemFormDialogComponent>>(MatDialogRef);
  private snackBar = inject(MatSnackBar);
  private productService = inject(ProductService);

  lineItemForm!: FormGroup;
  products: Product[] = [];

  constructor() {
    const data = this.data;

    // Load products for the select dropdown
    this.productService.getAll().subscribe((products) => {
      this.products = products;
    });
    // Initialize the form with data if available
    this.lineItemForm = this.fb.group({
      id: [data?.lineItem?.id || '', Validators.required],
      barCodeId: [data?.lineItem?.barCodeId || '', Validators.required],
      productId: [data?.lineItem?.product.id || '', Validators.required],
      cost: [data?.lineItem?.cost || '', Validators.required],
      displayPrice: [data?.lineItem?.displayPrice || '', Validators.required],
      discountedPrice: [data?.lineItem?.discountedPrice || '', Validators.required],
      quantity: [data?.lineItem?.quantity || '', Validators.required],
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onSave() {
    if (this.lineItemForm.valid) {
      this.dialogRef.close(this.lineItemForm.value);
    }
  }
}
