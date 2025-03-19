import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHistoriaClinicaComponent } from './crear-historia-clinica.component';

describe('CrearHistoriaClinicaComponent', () => {
  let component: CrearHistoriaClinicaComponent;
  let fixture: ComponentFixture<CrearHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearHistoriaClinicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
