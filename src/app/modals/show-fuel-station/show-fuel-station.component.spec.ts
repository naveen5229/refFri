import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFuelStationComponent } from './show-fuel-station.component';

describe('ShowFuelStationComponent', () => {
  let component: ShowFuelStationComponent;
  let fixture: ComponentFixture<ShowFuelStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFuelStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFuelStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
