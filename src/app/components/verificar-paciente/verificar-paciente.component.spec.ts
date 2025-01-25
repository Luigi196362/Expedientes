import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarPacienteComponent } from './verificar-paciente.component';

describe('VerificarPacienteComponent', () => {
  let component: VerificarPacienteComponent;
  let fixture: ComponentFixture<VerificarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
