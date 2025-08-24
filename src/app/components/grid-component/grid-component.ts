import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, Observable, of, retry } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


/**
 * GridComponent displays a table of users retrieved from the UserService.
 */
@Component({
	selector: 'app-grid-component',
	imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule],
	templateUrl: './grid-component.html',
	styleUrl: './grid-component.scss'
})
export class GridComponent implements OnInit {

	/** Angular Router instance used for navigation */
	private readonly router: Router;
	/** UserService instance for accessing user data */
	private readonly userService: UserService;

	/** Columns displayed in the user table */
	public readonly displayedColumns: string[] = ['username', 'dateExpiration', 'enabled'];

	/** Observable emitting the list of users to display */
	public users$!: Observable<User[]>;

	constructor() {
		this.router = inject(Router);
		this.userService = inject(UserService);
	}

	/**
   * Angular lifecycle hook that loads the list of users when the component is initialized.
   */
	public ngOnInit(): void {
		this.loadUsers();
	}

	/**
   * Loads the users from the UserService and sets the observable `users$`.
   * Applies a retry policy and error handling to avoid breaking the UI in case of errors.
   */
	private loadUsers(): void {
		this.users$ = this.userService.getAll().pipe(
			retry(1),
			catchError(err => {
				console.log('Failed to load users', err);
				return of([]);
			})
		);
	}

	/**
   * Navigates to the user creation form. Called from UI
   */
	public navigateToCreateUserForm(): void {
		this.router.navigate(['/form']);
	}
}
