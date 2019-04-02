import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveMissingIndustryComponent } from './resolve-missing-industry.component';

describe('ResolveMissingIndustryComponent', () => {
  let component: ResolveMissingIndustryComponent;
  let fixture: ComponentFixture<ResolveMissingIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolveMissingIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveMissingIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
