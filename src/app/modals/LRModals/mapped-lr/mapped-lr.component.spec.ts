import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedLrComponent } from './mapped-lr.component';

describe('MappedLrComponent', () => {
  let component: MappedLrComponent;
  let fixture: ComponentFixture<MappedLrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappedLrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappedLrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
