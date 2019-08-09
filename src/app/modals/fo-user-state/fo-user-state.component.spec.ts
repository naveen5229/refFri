import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoUserStateComponent } from './fo-user-state.component';

describe('FoUserStateComponent', () => {
  let component: FoUserStateComponent;
  let fixture: ComponentFixture<FoUserStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoUserStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoUserStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
