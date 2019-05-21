import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpStationAreaComponent } from './pump-station-area.component';

describe('PumpStationAreaComponent', () => {
  let component: PumpStationAreaComponent;
  let fixture: ComponentFixture<PumpStationAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpStationAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpStationAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
