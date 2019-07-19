import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearAdvicesComponent } from './clear-advices.component';

describe('ClearAdvicesComponent', () => {
  let component: ClearAdvicesComponent;
  let fixture: ComponentFixture<ClearAdvicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClearAdvicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearAdvicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
