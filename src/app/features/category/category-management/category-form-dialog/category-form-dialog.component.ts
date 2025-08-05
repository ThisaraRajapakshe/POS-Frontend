import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'pos-category-form-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButton, MatButtonModule],
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss'
})
export class CategoryFormDialogComponent {
  categoryForm!: FormGroup;

  constructor(
    // Injecting MAT_DIALOG_DATA to access data passed to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
  ) {
    this.categoryForm = this.fb.group({
      id: [data?.category?.id || '', Validators.required],
      name: [data?.category?.name || '', Validators.required]
    });
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onSave() {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }
}
