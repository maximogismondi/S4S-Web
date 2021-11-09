import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosGeneradosComponent } from './horarios-generados.component';

describe('HorariosGeneradosComponent', () => {
  let component: HorariosGeneradosComponent;
  let fixture: ComponentFixture<HorariosGeneradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorariosGeneradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorariosGeneradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
