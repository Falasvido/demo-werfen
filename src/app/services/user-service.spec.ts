import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserService } from './user-service';
import { User } from '../models/user';

describe('UserService', () => {
	let service: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UserService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return all users after delay', fakeAsync(() => {
		let result: User[] | undefined;

		service.getAll().subscribe(users => (result = users));
		expect(result).toBeUndefined();

		tick(2000);

		expect(result).toBeDefined();
		expect(result!.length).toBe(3);
	}));

	it('should add a new user and return it', fakeAsync(() => {
		const newUser = new User({
			username: 'Anna',
			password: '123',
			confirmPassword: '123',
			enabled: true,
			dateExpiration: new Date()
		});

		let result: User | undefined;

		service.save(newUser).subscribe(user => (result = user));
		tick(2000);

		expect(result).toBeDefined();
		expect(result!.username).toBe('Anna');

		service.getAll().subscribe(users => {
			expect(users.some(u => u.username === 'Anna')).toBeTrue();
		});
	}));

	it('should return true if username exists', fakeAsync(() => {
		let result: boolean | undefined;

		service.checkUsername('Jaume').subscribe(exists => (result = exists));

		tick(1500);

		expect(result).toBeTrue();
	}));

	it('should return false if username does not exist', fakeAsync(() => {
		let result: boolean | undefined;

		service.checkUsername('Kero').subscribe(exists => (result = exists));
		
		tick(1500);

		expect(result).toBeFalse();
	}));
});
