import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPropertiesComponent } from './ticket-properties.component';

describe('TicketPropertiesComponent', () => {
  let component: TicketPropertiesComponent;
  let fixture: ComponentFixture<TicketPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
