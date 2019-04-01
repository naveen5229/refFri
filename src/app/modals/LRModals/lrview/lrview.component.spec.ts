import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LRViewComponent } from './lrview.component';

describe('LRViewComponent', () => {
  let component: LRViewComponent;
  let fixture: ComponentFixture<LRViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LRViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LRViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
