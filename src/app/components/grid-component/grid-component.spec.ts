import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GridComponent } from './grid-component';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { delay, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('GridComponent', () => {
	let component: GridComponent;
	let fixture: ComponentFixture<GridComponent>;
	let userServiceSpy: jasmine.SpyObj<UserService>;
  	let routerSpy: jasmine.SpyObj<Router>;

	const mockUsers: User[] = [
		new User({ username: 'Jaume', password: '123', confirmPassword: '123', enabled: true, dateExpiration: new Date() }),
		new User({ username: 'Ricard', password: '123', confirmPassword: '123', enabled: false, dateExpiration: new Date() }),
		new User({ username: 'Javier', password: '123', confirmPassword: '123', enabled: true, dateExpiration: new Date() })
	];

	beforeEach(async () => {
		userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getAll']);
    	routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

		await TestBed.configureTestingModule({
			imports: [GridComponent],
			providers: [
				{ provide: UserService, useValue: userServiceSpy },
				{ provide: Router, useValue: routerSpy }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(GridComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show spinner while loading', fakeAsync(() => {
		userServiceSpy.getAll.and.returnValue(of(mockUsers).pipe(delay(2000)));

		fixture.detectChanges();

		const spinner = fixture.debugElement.query(By.css('#spinner'));
		expect(spinner).toBeTruthy();
	}));

	it('should render users in the table after load', fakeAsync(() => {
		userServiceSpy.getAll.and.returnValue(of(mockUsers));

		fixture.detectChanges();
		tick();
		fixture.detectChanges();
		tick();

		const rows = fixture.debugElement.queryAll(By.css('#user-row'));
		expect(rows.length).toBe(3);
	}));

	it('should mark disabled users with "disabled-row" class', fakeAsync(() => {
		userServiceSpy.getAll.and.returnValue(of(mockUsers));

		fixture.detectChanges();
		tick();
		fixture.detectChanges();

		const rows = fixture.debugElement.queryAll(By.css('#user-row'));
		expect(rows[1].nativeElement.classList).toContain('disabled-row');
	}));

	it('should navigate to create user form when button is clicked', fakeAsync(() => {
		userServiceSpy.getAll.and.returnValue(of(mockUsers));

		fixture.detectChanges();
		tick();
		fixture.detectChanges();

		const button = fixture.debugElement.query(By.css('#create-user-button'));
		button.triggerEventHandler('click', {});
		expect(routerSpy.navigate).toHaveBeenCalledWith(['/form']);
	}));

	it('should handle errors from service and show empty table', fakeAsync(() => {
		userServiceSpy.getAll.and.returnValue(throwError(() => new Error('Something unexpected happened')));

		fixture.detectChanges();
		tick();
		fixture.detectChanges();

		const rows = fixture.debugElement.queryAll(By.css('#user-row'));
		expect(rows.length).toBe(0);
	}));
});
