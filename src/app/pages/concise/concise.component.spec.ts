import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciseComponent } from './concise.component';

describe('ConciseComponent', () => {
  let component: ConciseComponent;
  let fixture: ComponentFixture<ConciseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConciseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
