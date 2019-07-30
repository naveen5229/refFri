import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMobileComponent } from './show-mobile.component';

describe('ShowMobileComponent', () => {
  let component: ShowMobileComponent;
  let fixture: ComponentFixture<ShowMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
