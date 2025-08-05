import { Component } from '@angular/core';
import { CardWrapperComponent } from '../../../shared/Components/card-wrapper/card-wrapper.component';
import { catchError, Observable, of, shareReplay } from 'rxjs';
import { ProductLineItem } from '../../../Core/models/Domains/product-line-item.model';
import { ProductLineItemService } from '../../../Core/services/product-line-item.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog.component';
import { LineItemFormDialogComponent } from './line-item-form-dialog/line-item-form-dialog.component';
import { LineItemTableComponent } from './line-item-table/line-item-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pos-line-item-management',
  imports: [CardWrapperComponent, LineItemTableComponent, MatTableModule, MatButtonModule],
  templateUrl: './line-item-management.component.html',
  styleUrl: './line-item-management.component.scss'
})
export class LineItemManagementComponent {
  lineItems$!: Observable<ProductLineItem[]>;

  constructor(private dialog: MatDialog, private lineItemService: ProductLineItemService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadLineItems();
  }

  loadLineItems() {
    this.lineItems$ = this.lineItemService.getAll().pipe(
      shareReplay(1), // Cache the result for performance
      catchError((error) => {

        this.snackBar.open('Failed to load line items', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        console.error('Error loading line items:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  onAdd() {
    const dialogRef = this.dialog.open(LineItemFormDialogComponent, {
      data: { mode: 'create' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.create(result).subscribe({
          next: () => {
            this.loadLineItems();
            this.snackBar.open('Line item created successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to create line item', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error creating line item:', error);
          }
        });
      }
    })
  }
  onEdit(lineItem: ProductLineItem) {
    const dialogRef = this.dialog.open(LineItemFormDialogComponent, {
      data: { mode: 'edit', lineItem },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.update(lineItem.id, result).subscribe({
          next: () => {
            this.loadLineItems();
            this.snackBar.open('Line item updated successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            this.lineItems$ = this.lineItemService.getAll();
          },
          error: (error) => {
            this.snackBar.open('Failed to update line item', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error updating line item:', error);
          }
        });
      }
    });
  }
  onDelete(lineItem: ProductLineItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete this line item "${lineItem.id}"?`, title: 'Confirm Deletion', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lineItemService.delete(lineItem.id).subscribe({
          next: () => {
            this.loadLineItems();
            this.snackBar.open('Line item deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          },
          error: (error) => {
            this.snackBar.open('Failed to delete line item', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
            console.error('Error deleting line item:', error);
          }
        });
      }
    });
  }
}
