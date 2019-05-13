import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ADDFOComponent } from './add-fo.component';

describe('ADDFOComponent', () => {
  let component: ADDFOComponent;
  let fixture: ComponentFixture<ADDFOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ADDFOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ADDFOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
