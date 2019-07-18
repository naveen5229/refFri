import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceViewComponent } from './advice-view.component';

describe('AdviceViewComponent', () => {
  let component: AdviceViewComponent;
  let fixture: ComponentFixture<AdviceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
