import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformativeDialogComponent } from './informative-dialog.component';

describe('InformativeDialogComponent', () => {
  let component: InformativeDialogComponent;
  let fixture: ComponentFixture<InformativeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformativeDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformativeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
