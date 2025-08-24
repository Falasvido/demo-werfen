import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CreateUserComponent } from './create-user-component';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay, of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('CreateUserComponent', () => {
	let component: CreateUserComponent;
	let fixture: ComponentFixture<CreateUserComponent>;
	let userServiceSpy: jasmine.SpyObj<UserService>;
	let routerSpy: jasmine.SpyObj<Router>;

	beforeEach(async () => {
		userServiceSpy = jasmine.createSpyObj('UserService', ['save', 'checkUsername']);
		routerSpy = jasmine.createSpyObj('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [CreateUserComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatProgressSpinnerModule],
			providers: [
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: Router, useValue: routerSpy },
				FormBuilder
			]
		}).compileComponents();

		fixture = TestBed.createComponent(CreateUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize the form with default values', () => {
		const form = component.form;
		expect(form).toBeDefined();
		expect(form.get('username')?.value).toBe('');
		expect(form.get('password')?.value).toBe('');
		expect(form.get('confirmPassword')?.value).toBe('');
		expect(form.get('enabled')?.value).toBeFalse();
		expect(form.get('dateExpiration')?.value).toBeInstanceOf(Date);
	});

	it('should mark form invalid if required fields are empty', () => {
		component.form.patchValue({ username: '', password: '', confirmPassword: '' });
		expect(component.form.valid).toBeFalse();
	});

	it('should validate password mismatch', () => {
		component.form.patchValue({ password: '123', confirmPassword: '321' });
		fixture.detectChanges();
		const errors = component.form.errors;
		expect(errors!['passwordMismatch']).toBeTrue();
	});

	it('should show spinner while loading', fakeAsync(() => {
		const testUser = {
			username: 'Kero',
			password: '123',
			confirmPassword: '123',
			enabled: true,
			dateExpiration: new Date()
		};
		userServiceSpy.save.and.returnValue(of(testUser).pipe(delay(1500)));

		component.form.patchValue(testUser);

		component.save();
		fixture.detectChanges();

		let spinner = fixture.debugElement.query(By.css('#spinner'));
		expect(spinner).toBeTruthy();
	}));

	it('should call save and navigate to grid on save', fakeAsync(() => {
		const testUser = {
			username: 'Kero',
			password: '123',
			confirmPassword: '123',
			enabled: true,
			dateExpiration: new Date()
		};
		userServiceSpy.save.and.returnValue(of(testUser));

		component.form.patchValue(testUser);

		component.save();
		tick();
		fixture.detectChanges();

		expect(userServiceSpy.save).toHaveBeenCalledWith(jasmine.objectContaining(testUser));
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/main']);
	}));

	it('should navigate to grid when cancel button is clicked', () => {
		const button = fixture.debugElement.query(By.css('#cancel-button'));
		button.triggerEventHandler('click', {});
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/main']);
	});
});
