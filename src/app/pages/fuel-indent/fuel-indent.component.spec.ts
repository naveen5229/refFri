import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelIndentComponent } from './fuel-indent.component';

describe('FuelIndentComponent', () => {
  let component: FuelIndentComponent;
  let fixture: ComponentFixture<FuelIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
