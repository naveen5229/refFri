import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingFuelComponent } from './remaining-fuel.component';

describe('RemainingFuelComponent', () => {
  let component: RemainingFuelComponent;
  let fixture: ComponentFixture<RemainingFuelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingFuelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingFuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
