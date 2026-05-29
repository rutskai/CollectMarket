import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverForm } from './recover-form';

describe('RecoverForm', () => {
  let component: RecoverForm;
  let fixture: ComponentFixture<RecoverForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
