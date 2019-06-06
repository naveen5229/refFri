import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TollSetteledRequestComponent } from './toll-setteled-request.component';

describe('TollSetteledRequestComponent', () => {
  let component: TollSetteledRequestComponent;
  let fixture: ComponentFixture<TollSetteledRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TollSetteledRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TollSetteledRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
