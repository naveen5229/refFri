import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripmasterreportComponent } from './tripmasterreport.component';

describe('TripmasterreportComponent', () => {
  let component: TripmasterreportComponent;
  let fixture: ComponentFixture<TripmasterreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripmasterreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripmasterreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
