import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteDataComponent } from './paciente-data.component';

describe('PacienteDataComponent', () => {
  let component: PacienteDataComponent;
  let fixture: ComponentFixture<PacienteDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacienteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
