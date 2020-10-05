import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripKmRepairViewComponent } from './trip-km-repair-view.component';

describe('TripKmRepairViewComponent', () => {
  let component: TripKmRepairViewComponent;
  let fixture: ComponentFixture<TripKmRepairViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripKmRepairViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripKmRepairViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
