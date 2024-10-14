export type User = {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    unsafeMetadata: {
        demographic?: string;  // Use optional chaining here
        gender?: string;
    };
}