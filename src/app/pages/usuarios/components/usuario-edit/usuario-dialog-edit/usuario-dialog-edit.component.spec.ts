import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioDialogEditComponent } from './usuario-dialog-edit.component';

describe('UsuarioDialogEditComponent', () => {
  let component: UsuarioDialogEditComponent;
  let fixture: ComponentFixture<UsuarioDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioDialogEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsuarioDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
