import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopVehicleRtoComponent } from './top-vehicle-rto.component';

describe('TopVehicleRtoComponent', () => {
  let component: TopVehicleRtoComponent;
  let fixture: ComponentFixture<TopVehicleRtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopVehicleRtoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopVehicleRtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
