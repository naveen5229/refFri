import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketForwardComponent } from './ticket-forward.component';

describe('TicketForwardComponent', () => {
  let component: TicketForwardComponent;
  let fixture: ComponentFixture<TicketForwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketForwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketForwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
