import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingChallanComponent } from './pending-challan.component';

describe('PendingChallanComponent', () => {
  let component: PendingChallanComponent;
  let fixture: ComponentFixture<PendingChallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingChallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
