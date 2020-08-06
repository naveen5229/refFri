import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDataMapComponent } from './show-data-map.component';

describe('ShowDataMapComponent', () => {
  let component: ShowDataMapComponent;
  let fixture: ComponentFixture<ShowDataMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDataMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDataMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
