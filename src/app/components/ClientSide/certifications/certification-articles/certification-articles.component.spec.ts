import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationArticlesComponent } from './certification-articles.component';

describe('CertificationArticlesComponent', () => {
  let component: CertificationArticlesComponent;
  let fixture: ComponentFixture<CertificationArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationArticlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
