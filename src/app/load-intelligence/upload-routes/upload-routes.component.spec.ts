import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRoutesComponent } from './upload-routes.component';

describe('UploadRoutesComponent', () => {
  let component: UploadRoutesComponent;
  let fixture: ComponentFixture<UploadRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
