import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportingDocComponent } from './supporting-doc.component';

describe('SupportingDocComponent', () => {
  let component: SupportingDocComponent;
  let fixture: ComponentFixture<SupportingDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportingDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportingDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
