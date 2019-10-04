import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmergeLRStateComponent } from './unmerge-lrstate.component';

describe('UnmergeLRStateComponent', () => {
  let component: UnmergeLRStateComponent;
  let fixture: ComponentFixture<UnmergeLRStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmergeLRStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmergeLRStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
