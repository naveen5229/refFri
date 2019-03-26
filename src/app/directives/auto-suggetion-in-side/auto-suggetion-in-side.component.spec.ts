import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSuggetionInSideComponent } from './auto-suggetion-in-side.component';

describe('AutoSuggetionInSideComponent', () => {
  let component: AutoSuggetionInSideComponent;
  let fixture: ComponentFixture<AutoSuggetionInSideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSuggetionInSideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSuggetionInSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
