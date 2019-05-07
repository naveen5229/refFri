import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLicenceDetailComponent } from './pending-licence-detail.component';

describe('PendingLicenceDetailComponent', () => {
  let component: PendingLicenceDetailComponent;
  let fixture: ComponentFixture<PendingLicenceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingLicenceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLicenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
