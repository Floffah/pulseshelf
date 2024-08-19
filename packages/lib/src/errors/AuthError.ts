export enum AuthError {
    UNAUTHORIZED = "You must be logged in to perform this action",
    INVALID_CREDENTIALS = "Invalid credentials",
    NOT_INVITED = "You must be invited to register",
    EMAIL_TAKEN = "Email is already taken",
    NAME_TAKEN = "Name is already taken",
}
