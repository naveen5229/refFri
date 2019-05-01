import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStationEntryComponent } from './fuel-station-entry.component';

describe('FuelStationEntryComponent', () => {
  let component: FuelStationEntryComponent;
  let fixture: ComponentFixture<FuelStationEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelStationEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelStationEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
