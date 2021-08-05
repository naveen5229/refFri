import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripconsignmentComponent } from './tripconsignment.component';

describe('TripconsignmentComponent', () => {
  let component: TripconsignmentComponent;
  let fixture: ComponentFixture<TripconsignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripconsignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripconsignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
