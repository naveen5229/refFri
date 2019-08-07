import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelMasterComponent } from './fuel-master.component';

describe('FuelMasterComponent', () => {
  let component: FuelMasterComponent;
  let fixture: ComponentFixture<FuelMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
