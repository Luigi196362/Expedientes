import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedChangesComponent } from './unsaved-changes-dialog.component';

describe('UnsavedChangesComponent', () => {
  let component: UnsavedChangesComponent;
  let fixture: ComponentFixture<UnsavedChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnsavedChangesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UnsavedChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
