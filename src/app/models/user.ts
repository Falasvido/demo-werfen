/**
 * Represents a user in the system.
 */
export class User {
    /** The unique username of the user */
    username!: string;
    password!: string;
    confirmPassword!: string;
    enabled!: boolean;
    dateExpiration!: Date;

    /**
     * Creates a new `User` instance and assigns the provided values.
     * @param {Partial<User>} data An object containing user properties to initialize.
     */
    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}
