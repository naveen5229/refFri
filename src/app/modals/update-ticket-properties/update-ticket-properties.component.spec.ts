import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketPropertiesComponent } from './update-ticket-properties.component';

describe('UpdateTicketPropertiesComponent', () => {
  let component: UpdateTicketPropertiesComponent;
  let fixture: ComponentFixture<UpdateTicketPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTicketPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTicketPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
