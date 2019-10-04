import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnMergeStateComponent } from './un-merge-state.component';

describe('UnMergeStateComponent', () => {
  let component: UnMergeStateComponent;
  let fixture: ComponentFixture<UnMergeStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnMergeStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnMergeStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
