import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateLrMainfestoComponent } from './generate-lr-mainfesto.component';

describe('GenerateLrMainfestoComponent', () => {
  let component: GenerateLrMainfestoComponent;
  let fixture: ComponentFixture<GenerateLrMainfestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateLrMainfestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateLrMainfestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
