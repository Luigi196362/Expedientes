import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaDataComponent } from './historia-data.component';

describe('HistoriaDataComponent', () => {
  let component: HistoriaDataComponent;
  let fixture: ComponentFixture<HistoriaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriaDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
