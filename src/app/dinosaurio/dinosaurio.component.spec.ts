import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinosaurioComponent } from './dinosaurio.component';

describe('DinosaurioComponent', () => {
  let component: DinosaurioComponent;
  let fixture: ComponentFixture<DinosaurioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinosaurioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinosaurioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
