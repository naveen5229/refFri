import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgCallsComponent } from './tmg-calls.component';

describe('TmgCallsComponent', () => {
  let component: TmgCallsComponent;
  let fixture: ComponentFixture<TmgCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
