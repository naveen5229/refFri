import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCompanyAssociationComponent } from './bulk-company-association.component';

describe('BulkCompanyAssociationComponent', () => {
  let component: BulkCompanyAssociationComponent;
  let fixture: ComponentFixture<BulkCompanyAssociationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCompanyAssociationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCompanyAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
