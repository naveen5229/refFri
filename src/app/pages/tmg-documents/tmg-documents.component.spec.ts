import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmgDocumentsComponent } from './tmg-documents.component';

describe('TmgDocumentsComponent', () => {
  let component: TmgDocumentsComponent;
  let fixture: ComponentFixture<TmgDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmgDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmgDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
