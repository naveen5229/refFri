import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportAreaComponent } from './transport-area.component';

describe('TransportAreaComponent', () => {
  let component: TransportAreaComponent;
  let fixture: ComponentFixture<TransportAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
