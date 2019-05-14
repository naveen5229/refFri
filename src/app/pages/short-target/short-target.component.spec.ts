import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortTargetComponent } from './short-target.component';

describe('ShortTargetComponent', () => {
  let component: ShortTargetComponent;
  let fixture: ComponentFixture<ShortTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
