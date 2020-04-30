import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathViewverComponent } from './path-viewver.component';

describe('PathViewverComponent', () => {
  let component: PathViewverComponent;
  let fixture: ComponentFixture<PathViewverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathViewverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathViewverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
