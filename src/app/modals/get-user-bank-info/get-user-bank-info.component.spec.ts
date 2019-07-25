import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUserBankInfoComponent } from './get-user-bank-info.component';

describe('GetUserBankInfoComponent', () => {
  let component: GetUserBankInfoComponent;
  let fixture: ComponentFixture<GetUserBankInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetUserBankInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUserBankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
