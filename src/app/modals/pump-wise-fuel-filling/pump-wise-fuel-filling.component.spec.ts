import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpWiseFuelFillingComponent } from './pump-wise-fuel-filling.component';

describe('PumpWiseFuelFillingComponent', () => {
  let component: PumpWiseFuelFillingComponent;
  let fixture: ComponentFixture<PumpWiseFuelFillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpWiseFuelFillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpWiseFuelFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
