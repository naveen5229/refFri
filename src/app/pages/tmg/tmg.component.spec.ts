import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgComponent } from './tmg.component';

describe('TmgComponent', () => {
  let component: TmgComponent;
  let fixture: ComponentFixture<TmgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
