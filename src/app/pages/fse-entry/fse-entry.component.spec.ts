import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FSEEntryComponent } from './fse-entry.component';

describe('FSEEntryComponent', () => {
  let component: FSEEntryComponent;
  let fixture: ComponentFixture<FSEEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FSEEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FSEEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
