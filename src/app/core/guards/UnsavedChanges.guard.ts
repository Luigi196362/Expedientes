import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { UnsavedChangesComponent } from '../../shared/unsaved-changes-dialog/unsaved-changes-dialog.component';
import { AuthService } from '../services/Auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<any> {
  constructor(private dialog: MatDialog, private authService: AuthService) { }

  canDeactivate(component: any): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
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
    return true;
  }

}
