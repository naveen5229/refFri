import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivercontactedComponent } from './drivercontacted.component';

describe('DrivercontactedComponent', () => {
  let component: DrivercontactedComponent;
  let fixture: ComponentFixture<DrivercontactedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivercontactedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivercontactedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
