import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<any> {
    constructor(private dialog: MatDialog) {}
  
    canDeactivate(component: any): Observable<boolean> | Promise<boolean> | boolean {
      if (component.isFormDirty && component.isFormDirty()) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent);
  
        return dialogRef.afterClosed().toPromise().then(result => {
          return result; // true or false según la elección del usuario
        });
      }
      return true;
    }
  }
  