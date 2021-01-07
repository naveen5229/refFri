import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketFormFieldComponent } from './ticket-form-field.component';

describe('TicketFormFieldComponent', () => {
  let component: TicketFormFieldComponent;
  let fixture: ComponentFixture<TicketFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
