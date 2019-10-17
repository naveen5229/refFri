import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEntryApprovalComponent } from './account-entry-approval.component';

describe('AccountEntryApprovalComponent', () => {
  let component: AccountEntryApprovalComponent;
  let fixture: ComponentFixture<AccountEntryApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountEntryApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountEntryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
