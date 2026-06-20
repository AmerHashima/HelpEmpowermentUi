import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExportTableComponent } from './student-export-table.component';

describe('StudentExportTableComponent', () => {
  let component: StudentExportTableComponent;
  let fixture: ComponentFixture<StudentExportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentExportTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentExportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
