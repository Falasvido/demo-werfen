import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { delay, Observable, of } from 'rxjs';


/**
 * Service that handles user operations such as retrieving, adding, and checking users.
 * This service uses an in-memory array to simulate a database.
 */
@Injectable({
	providedIn: 'root'
})
export class UserService {

	private users: User[] = [
		new User({ username: 'Jaume', password: '123', confirmPassword: '123', enabled: true, dateExpiration: new Date() }),
		new User({ username: 'Ricard', password: '123', confirmPassword: '123', enabled: false, dateExpiration: new Date() }),
		new User({ username: 'Javier', password: '123', confirmPassword: '123', enabled: true, dateExpiration: new Date() })
	];

	/**
   * Retrieves all users from the in-memory "database".
   * @returns {Observable<User[]>} An observable that emits an array of all users after a 2-second delay to simulate latency.
   */
	public getAll(): Observable<User[]> {
		return of(this.users).pipe(delay(2000));
	}

	/**
   * Adds a new user to the in-memory "database".
   * @param {User} user The user object to be added.
   * @returns {Observable<User>} An observable that emits the added user after a 2-second delay to simulate latency.
   */
	public save(user: User): Observable<User> {
		this.users.push(user);
		return of(user).pipe(delay(2000));
	}

	/**
   * Checks if a username is already taken in the in-memory "database".
   * @param {string} username The username to check for availability.
   * @returns {Observable<boolean>} An observable that emits `true` if the username already exists, `false` if it is available, after a 1.5-second delay to simulate latency.
   */
	public checkUsername(username: string): Observable<boolean> {
		return of(this.users.some(user => user.username == username)).pipe(delay(1500));
	}
}
