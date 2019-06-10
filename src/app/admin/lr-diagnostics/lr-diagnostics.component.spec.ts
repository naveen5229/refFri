import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LrDiagnosticsComponent } from './lr-diagnostics.component';

describe('LrDiagnosticsComponent', () => {
  let component: LrDiagnosticsComponent;
  let fixture: ComponentFixture<LrDiagnosticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LrDiagnosticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LrDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
