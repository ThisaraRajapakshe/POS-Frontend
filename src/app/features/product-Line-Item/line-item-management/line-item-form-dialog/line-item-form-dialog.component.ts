import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { CardWrapperComponent } from "../../../../shared/Components/card-wrapper/card-wrapper.component";

@Component({
  selector: 'pos-line-item-form-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, CardWrapperComponent],
  templateUrl: './line-item-form-dialog.component.html',
  styleUrl: './line-item-form-dialog.component.scss'
})
export class LineItemFormDialogComponent {
  lineItemForm!: FormGroup;

  constructor(
    // Injecting MAT_DIALOG_DATA to access data passed to the dialog
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LineItemFormDialogComponent>)
  {
    this.lineItemForm = this.fb.group({
      id: [data?.lineItem?.id || '', Validators.required],
      barCodeId: [data?.lineItem?.barCodeId || '', Validators.required],
      productId: [data?.lineItem?.product.id || '', Validators.required],
      cost: [data?.lineItem?.cost || '', Validators.required],
      displayPrice: [data?.lineItem?.displayPrice || '', Validators.required],
      discountedPrice: [data?.lineItem?.discountedPrice || '', Validators.required],
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
