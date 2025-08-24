import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


/**
 * Validator function that checks if two password fields in a FormGroup match.
 *
 * Used in reactive forms to ensure that `password` and `confirmPassword` fields are identical before submission.
 *
 * @param passwordKey - The name of the password field in the FormGroup.
 * @param confirmPasswordKey - The name of the confirm password field in the FormGroup.
 * @returns A `ValidatorFn` that can be attached to a FormGroup.
 *
 * @example
 * this.form = this.formBuilder.group({
 *   password: ['', Validators.required],
 *   confirmPassword: ['', Validators.required]
 * }, { validators: passwordMatchValidator('password', 'confirmPassword') });
 */
export function passwordMatchValidator(
	passwordKey: string,
	confirmPasswordKey: string
): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const password = formGroup.get(passwordKey)?.value;
		const confirmPassword = formGroup.get(confirmPasswordKey)?.value;

		if (!password || !confirmPassword) {
			return null;
		}

		if (password !== confirmPassword) {
			formGroup.get(confirmPasswordKey)?.setErrors({ passwordMismatch: true });
			return { passwordMismatch: true };
		}
		else {
			const confirmPasswordControl = formGroup.get(confirmPasswordKey);
			if (confirmPasswordControl?.errors) {
				const errors = { ...confirmPasswordControl.errors };
				delete errors['passwordMismatch'];
				confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
			}
			return null;
		}
	};
}