import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDialogComponent } from './paciente-dialog.component';

describe('PacienteDialogComponent', () => {
  let component: PacienteDialogComponent;
  let fixture: ComponentFixture<PacienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PacienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
