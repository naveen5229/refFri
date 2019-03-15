import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VSCTicketAuditComponent } from './vscticket-audit.component';

describe('VSCTicketAuditComponent', () => {
  let component: VSCTicketAuditComponent;
  let fixture: ComponentFixture<VSCTicketAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VSCTicketAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VSCTicketAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
