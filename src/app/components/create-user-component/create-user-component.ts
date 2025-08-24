import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { passwordMatchValidator } from '../../validators/match-password-validator';
import { take } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { usernameExistsValidator } from '../../validators/username-exists-validator';


/**
 * CreateUserComponent provides a form to create a new user in the system.
 *
 * It includes form validation, custom validators for password matching and username availability, and handles submission to the UserService.
 */
@Component({
	selector: 'app-create-user-component',
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule],
	templateUrl: './create-user-component.html',
	styleUrl: './create-user-component.scss'
})
export class CreateUserComponent implements OnInit {

	/** Angular Router instance for navigation */
	private readonly router: Router;
	/** Angular FormBuilder to create reactive forms */
	private readonly formBuilder: FormBuilder;
	/** UserService instance to interact with user data */
	private readonly userService: UserService;

	/** Reactive form group for user creation */
	public form!: FormGroup;

	/** Indicates whether the form submission is in progress */
	public loading: boolean = false;

	constructor() {
		this.router = inject(Router);
		this.formBuilder = inject(FormBuilder);
		this.userService = inject(UserService);
	}

	/**
   * Angular lifecycle hook that initializes the user creation form.
   */
	public ngOnInit(): void {
		this.initializeForm();
	}

	/**
   * Initializes the reactive form with controls, validators, and async validators.
   * - `username` requires 5-15 characters and must be unique.
   * - `password` and `confirmPassword` must match.
   * - `username`, `password` and `confirmPassword` must be specified.
   */
	private initializeForm(): void {
		this.form = this.formBuilder.group({
			username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)], [usernameExistsValidator(this.userService)]],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			enabled: [false],
			dateExpiration: [new Date()]
		},
			{ validators: passwordMatchValidator('password', 'confirmPassword') }
		);
	}

	/**
   * Navigates back to the main grid view after successful user creation or canceling the operation through UI button.
   */
	public navigateToGrid(): void {
		this.router.navigate(['/main']);
	}

	/**
   * Submits the form to create a new user.
   * Handles form loading state and calls the UserService to save the user.
   */
	public save(): void {
		this.loading = true;
		const user = new User({ ...this.form.value });

		this.userService.save(user).pipe(take(1)).subscribe({
			next: _ => {
				this.navigateToGrid();
			},
			error: (error) => {
				console.log(error);
			},
			complete: () => {
				this.loading = false;
			}
		});
	}
}
