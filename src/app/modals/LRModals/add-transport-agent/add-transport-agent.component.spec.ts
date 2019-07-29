import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransportAgentComponent } from './add-transport-agent.component';

describe('AddTransportAgentComponent', () => {
  let component: AddTransportAgentComponent;
  let fixture: ComponentFixture<AddTransportAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransportAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransportAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
