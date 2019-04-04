import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingLicenceComponent } from './pending-licence.component';

describe('PendingLicenceComponent', () => {
  let component: PendingLicenceComponent;
  let fixture: ComponentFixture<PendingLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
