import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportconfigComponent } from './reportconfig.component';

describe('ReportconfigComponent', () => {
  let component: ReportconfigComponent;
  let fixture: ComponentFixture<ReportconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
