import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorerequisitionsComponent } from './storerequisitions.component';

describe('StorerequisitionsComponent', () => {
  let component: StorerequisitionsComponent;
  let fixture: ComponentFixture<StorerequisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorerequisitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorerequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
