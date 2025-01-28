import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteListComponent } from './paciente-list.component';

describe('PacienteListComponent', () => {
  let component: PacienteListComponent;
  let fixture: ComponentFixture<PacienteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PacienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
