import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallanPendingRequestComponent } from './challan-pending-request.component';

describe('ChallanPendingRequestComponent', () => {
  let component: ChallanPendingRequestComponent;
  let fixture: ComponentFixture<ChallanPendingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallanPendingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallanPendingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
