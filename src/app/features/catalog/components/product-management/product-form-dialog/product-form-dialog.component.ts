import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { CategoryService } from '../../../services';
import { Category } from '../../../models';


@Component({
  selector: 'pos-product-form-dialog',
  imports: [MatSelectModule, MatInputModule, MatDialogContent, MatDialogModule, FormsModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatButtonModule],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.scss'
})
export class ProductFormDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<ProductFormDialogComponent>>(MatDialogRef);
  private categoryService = inject(CategoryService);

  productForm!: FormGroup;
  categories: Category[] = [];

  constructor() {
    const data = this.data;

    // load categories for the select dropdown
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });

    // Initialize the form with data if available
    this.productForm = this.fb.group({
      id: [data?.product?.id || ''],
      name: [data?.product?.name || '', Validators.required],
      categoryId: [data?.product?.category.id || '', Validators.required]
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onSave() {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }
}
