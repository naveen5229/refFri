import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclewiseTolltransactionComponent } from './vehiclewise-tolltransaction.component';

describe('VehiclewiseTolltransactionComponent', () => {
  let component: VehiclewiseTolltransactionComponent;
  let fixture: ComponentFixture<VehiclewiseTolltransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclewiseTolltransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclewiseTolltransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
