import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnwardKmpdComponent } from './onward-kmpd.component';

describe('OnwardKmpdComponent', () => {
  let component: OnwardKmpdComponent;
  let fixture: ComponentFixture<OnwardKmpdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnwardKmpdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnwardKmpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
