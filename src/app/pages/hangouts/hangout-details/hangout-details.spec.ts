import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HangoutDetails } from './hangout-details';

describe('HangoutDetails', () => {
  let component: HangoutDetails;
  let fixture: ComponentFixture<HangoutDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HangoutDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HangoutDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
