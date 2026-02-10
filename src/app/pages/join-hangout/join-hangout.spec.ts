import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinHangout } from './join-hangout';

describe('JoinHangout', () => {
  let component: JoinHangout;
  let fixture: ComponentFixture<JoinHangout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinHangout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinHangout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
