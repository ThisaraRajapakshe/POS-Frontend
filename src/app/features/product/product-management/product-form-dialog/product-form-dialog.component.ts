import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'pos-product-form-dialog',
  imports: [MatSelectModule, MatInputModule, MatDialogContent, MatDialogModule,
    FormsModule, ReactiveFormsModule, MatLabel, MatFormFieldModule, MatButtonModule, CommonModule],
  templateUrl: './product-form-dialog.component.html',
  styleUrl: './product-form-dialog.component.scss'
})
export class ProductFormDialogComponent {
  productForm!: FormGroup;

  constructor(
    // Injecting MAT_DIALOG_DATA to access data passed to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
  ) {
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
