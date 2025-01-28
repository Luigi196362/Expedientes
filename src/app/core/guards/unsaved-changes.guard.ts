import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { UnsavedChangesComponent } from '../../shared/unsaved-changes-dialog/unsaved-changes-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<any> {
  constructor(private dialog: MatDialog) { }

  canDeactivate(component: any): Observable<boolean> | Promise<boolean> | boolean {

    if (component.isSaving) {
      return true;
    }

    if (component.isFormDirty && component.isFormDirty()) {
      const dialogRef = this.dialog.open(UnsavedChangesComponent);

      return dialogRef.afterClosed().toPromise().then(result => {
        return result; // true or false según la elección del usuario
      });
    }
    return true;
  }
}
