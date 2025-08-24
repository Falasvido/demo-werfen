import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user-service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/**
 * Async validator that checks if a username already exists in the system.
 *
 * Used in reactive forms to validate the uniqueness of a username field.
 *
 * @param userService - The `UserService` used to check username availability.
 * @returns An `AsyncValidatorFn` that returns an observable emitting a validation error object if the username exists, or `null` if it is available.
 *
 * @example
 * this.form = this.formBuilder.group({
 *   username: ['', [Validators.required], [usernameExistsValidator(this.userService)]]
 * });
 */
export function usernameExistsValidator(userService: UserService): AsyncValidatorFn {
	return (control: AbstractControl): Observable<ValidationErrors | null> => {
		if (!control.value) {
			return of(null);
		}

		return userService.checkUsername(control.value).pipe(
			map(exists => (exists ? { usernameTaken: true } : null))
		);
	};
}