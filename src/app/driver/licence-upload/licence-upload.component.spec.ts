import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceUploadComponent } from './licence-upload.component';

describe('LicenceUploadComponent', () => {
  let component: LicenceUploadComponent;
  let fixture: ComponentFixture<LicenceUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenceUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
