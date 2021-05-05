import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostAgedComponent } from './most-aged.component';

describe('MostAgedComponent', () => {
  let component: MostAgedComponent;
  let fixture: ComponentFixture<MostAgedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostAgedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostAgedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
