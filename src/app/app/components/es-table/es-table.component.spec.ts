import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsTableComponent } from './es-table.component';

describe('EsTableComponent', () => {
  let component: EsTableComponent;
  let fixture: ComponentFixture<EsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
