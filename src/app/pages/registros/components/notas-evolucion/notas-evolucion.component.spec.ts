import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasEvolucionComponent } from './notas-evolucion.component';

describe('NotasEvolucionComponent', () => {
  let component: NotasEvolucionComponent;
  let fixture: ComponentFixture<NotasEvolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasEvolucionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotasEvolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
