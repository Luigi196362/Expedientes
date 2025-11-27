import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDataComponent } from './nota-data.component';

describe('NotaDataComponent', () => {
  let component: NotaDataComponent;
  let fixture: ComponentFixture<NotaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
