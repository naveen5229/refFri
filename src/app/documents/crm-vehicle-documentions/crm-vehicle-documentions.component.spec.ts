import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmVehicleDocumentionsComponent } from './crm-vehicle-documentions.component';

describe('CrmVehicleDocumentionsComponent', () => {
  let component: CrmVehicleDocumentionsComponent;
  let fixture: ComponentFixture<CrmVehicleDocumentionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmVehicleDocumentionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmVehicleDocumentionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
