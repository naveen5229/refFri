import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFillingsComponent } from './import-fillings.component';

describe('ImportFillingsComponent', () => {
  let component: ImportFillingsComponent;
  let fixture: ComponentFixture<ImportFillingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFillingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
