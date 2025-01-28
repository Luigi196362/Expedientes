import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNotasEvolucionComponent } from './crear-notas-evolucion.component';

describe('CrearNotasEvolucionComponent', () => {
  let component: CrearNotasEvolucionComponent;
  let fixture: ComponentFixture<CrearNotasEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNotasEvolucionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearNotasEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
