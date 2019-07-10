import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrieghtRateInputComponent } from './frieght-rate-input.component';

describe('FrieghtRateInputComponent', () => {
  let component: FrieghtRateInputComponent;
  let fixture: ComponentFixture<FrieghtRateInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrieghtRateInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrieghtRateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
