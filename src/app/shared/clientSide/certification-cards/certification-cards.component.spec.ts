import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationCardsComponent } from './certification-cards.component';

describe('CertificationCardsComponent', () => {
  let component: CertificationCardsComponent;
  let fixture: ComponentFixture<CertificationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificationCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
