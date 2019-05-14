import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFencingComponent } from './site-fencing.component';

describe('SiteFencingComponent', () => {
  let component: SiteFencingComponent;
  let fixture: ComponentFixture<SiteFencingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteFencingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteFencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
