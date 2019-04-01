import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAgentsComponent } from './transport-agents.component';

describe('TransportAgentsComponent', () => {
  let component: TransportAgentsComponent;
  let fixture: ComponentFixture<TransportAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
