import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLRComponent } from './generate-lr.component';

describe('GenerateLRComponent', () => {
  let component: GenerateLRComponent;
  let fixture: ComponentFixture<GenerateLRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateLRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
