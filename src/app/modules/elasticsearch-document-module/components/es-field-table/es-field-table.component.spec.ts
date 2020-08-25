import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsFieldTableComponent } from './es-field-table.component';

describe('EsFieldTableComponent', () => {
  let component: EsFieldTableComponent;
  let fixture: ComponentFixture<EsFieldTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsFieldTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsFieldTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
