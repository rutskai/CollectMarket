import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCardPage } from './detail-card-page';

describe('DetailCardPage', () => {
  let component: DetailCardPage;
  let fixture: ComponentFixture<DetailCardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCardPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
