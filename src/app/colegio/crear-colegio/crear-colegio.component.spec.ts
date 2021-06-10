import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearColegioComponent } from './crear-colegio.component';

describe('CrearColegioComponent', () => {
  let component: CrearColegioComponent;
  let fixture: ComponentFixture<CrearColegioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearColegioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearColegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
