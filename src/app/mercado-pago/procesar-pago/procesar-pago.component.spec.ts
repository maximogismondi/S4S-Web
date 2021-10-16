import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarPagoComponent } from './procesar-pago.component';

describe('ProcesarPagoComponent', () => {
  let component: ProcesarPagoComponent;
  let fixture: ComponentFixture<ProcesarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesarPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
