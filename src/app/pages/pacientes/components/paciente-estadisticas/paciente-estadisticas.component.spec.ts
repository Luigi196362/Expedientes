import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEstadisticasComponent } from './paciente-estadisticas.component';

describe('PacienteEstadisticasComponent', () => {
  let component: PacienteEstadisticasComponent;
  let fixture: ComponentFixture<PacienteEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteEstadisticasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PacienteEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
