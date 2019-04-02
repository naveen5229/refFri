import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTransportAgentComponent } from './update-transport-agent.component';

describe('UpdateTransportAgentComponent', () => {
  let component: UpdateTransportAgentComponent;
  let fixture: ComponentFixture<UpdateTransportAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTransportAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTransportAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
