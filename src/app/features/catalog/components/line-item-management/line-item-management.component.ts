import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { ProductLineItem } from '../../models';
import { ProductLineItemService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { LineItemFormDialogComponent } from './line-item-form-dialog/line-item-form-dialog.component';
import { LineItemTableComponent } from './line-item-table/line-item-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/dialogs/confirm-dialog.component';
import { CardWrapperComponent } from '../../../../shared/Components/card-wrapper/card-wrapper.component';
import { filterData } from '../../../../shared/utils/search-helper';
import { SearchBarComponent } from "../../../../shared/Components/search-bar/search-bar.component";

@Component({
  selector: 'pos-line-item-management',
  imports: [LineItemTableComponent, MatTableModule, MatButtonModule, CardWrapperComponent, SearchBarComponent],
  templateUrl: './line-item-management.component.html',
  styleUrl: './line-item-management.component.scss'
})
export class LineItemManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private lineItemService = inject(ProductLineItemService);
  private snackBar = inject(MatSnackBar);

  lineItems: WritableSignal<ProductLineItem[]> = signal([]);
  private allLineItems: ProductLineItem[] = [];

  ngOnInit(): void {
    this.loadLineItems();
  }

  loadLineItems() {
    this.lineItemService.getAll().subscribe({
      next: (data) => {
        this.lineItems.set(data);
        this.allLineItems = data;
      },
      error: (error) => {
        console.error('Error loading line items:', error);
        this.lineItems.set([]); 
        this.allLineItems = [];
        this.snackBar.open('Failed to load line items', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    });
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
            this.loadLineItems();
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
  // Search Functionality
  onSearchLineItems(searchTerm: string) {
    const filtered = filterData(searchTerm, this.allLineItems, ['product.name', 'barCodeId']);
    this.lineItems.set(filtered);
  }
}
