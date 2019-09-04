import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { onwardKmpdComponent } from './onward-kmpd.component';

describe('OnwardKmpdComponent', () => {
  let component: onwardKmpdComponent;
  let fixture: ComponentFixture<onwardKmpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [onwardKmpdComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(onwardKmpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
