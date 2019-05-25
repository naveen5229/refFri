import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HaltDensityComponent } from './halt-density.component';

describe('HaltDensityComponent', () => {
  let component: HaltDensityComponent;
  let fixture: ComponentFixture<HaltDensityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HaltDensityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HaltDensityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
