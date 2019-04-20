import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePeriodsComponent } from './choose-periods.component';

describe('ChoosePeriodsComponent', () => {
  let component: ChoosePeriodsComponent;
  let fixture: ComponentFixture<ChoosePeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
