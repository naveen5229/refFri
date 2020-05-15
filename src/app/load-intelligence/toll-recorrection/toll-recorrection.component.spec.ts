import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollRecorrectionComponent } from './toll-recorrection.component';

describe('TollRecorrectionComponent', () => {
  let component: TollRecorrectionComponent;
  let fixture: ComponentFixture<TollRecorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollRecorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollRecorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
