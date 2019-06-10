import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmappedLrComponent } from './unmapped-lr.component';

describe('UnmappedLrComponent', () => {
  let component: UnmappedLrComponent;
  let fixture: ComponentFixture<UnmappedLrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnmappedLrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmappedLrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
