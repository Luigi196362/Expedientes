import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolDialogEditComponent } from './rol-dialog-edit.component';

describe('RolDialogEditComponent', () => {
  let component: RolDialogEditComponent;
  let fixture: ComponentFixture<RolDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolDialogEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RolDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
