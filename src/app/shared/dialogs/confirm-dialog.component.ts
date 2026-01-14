import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'pos-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  data = inject<{
    title?: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}>(MAT_DIALOG_DATA);

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }
}
