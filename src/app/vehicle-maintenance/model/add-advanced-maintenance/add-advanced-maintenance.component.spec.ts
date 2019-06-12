import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAdvancedMaintenanceComponent } from './add-advanced-maintenance.component';

describe('AddAdvancedMaintenanceComponent', () => {
  let component: AddAdvancedMaintenanceComponent;
  let fixture: ComponentFixture<AddAdvancedMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvancedMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvancedMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
