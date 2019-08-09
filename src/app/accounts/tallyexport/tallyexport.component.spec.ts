import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallyexportComponent } from './tallyexport.component';

describe('TallyexportComponent', () => {
  let component: TallyexportComponent;
  let fixture: ComponentFixture<TallyexportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallyexportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallyexportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
