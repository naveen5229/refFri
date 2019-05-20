import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelRulesComponent } from './fuel-rules.component';

describe('FuelRulesComponent', () => {
  let component: FuelRulesComponent;
  let fixture: ComponentFixture<FuelRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
