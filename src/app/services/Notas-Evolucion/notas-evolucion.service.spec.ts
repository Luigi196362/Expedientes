import { TestBed } from '@angular/core/testing';

import { NotasEvolucionService } from './notas-evolucion.service';

describe('NotasEvolucionService', () => {
  let service: NotasEvolucionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotasEvolucionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
