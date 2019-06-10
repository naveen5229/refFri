import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VscDiagnosisComponent } from './vsc-diagnosis.component';

describe('VscDiagnosisComponent', () => {
  let component: VscDiagnosisComponent;
  let fixture: ComponentFixture<VscDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VscDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VscDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
