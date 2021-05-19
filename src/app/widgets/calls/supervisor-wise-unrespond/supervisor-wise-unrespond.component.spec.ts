import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorWiseUnrespondComponent } from './supervisor-wise-unrespond.component';

describe('SupervisorWiseUnrespondComponent', () => {
  let component: SupervisorWiseUnrespondComponent;
  let fixture: ComponentFixture<SupervisorWiseUnrespondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupervisorWiseUnrespondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorWiseUnrespondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
