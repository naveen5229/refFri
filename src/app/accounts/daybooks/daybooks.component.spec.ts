import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaybooksComponent } from './daybooks.component';

describe('DaybooksComponent', () => {
  let component: DaybooksComponent;
  let fixture: ComponentFixture<DaybooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaybooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaybooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
