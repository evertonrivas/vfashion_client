import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastRenewComponent } from './toast-renew.component';

describe('ToastRenewComponent', () => {
  let component: ToastRenewComponent;
  let fixture: ComponentFixture<ToastRenewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToastRenewComponent]
    });
    fixture = TestBed.createComponent(ToastRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
