export type User = {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    emailAddresses: string;
    imageUrl: string;
    unsafeMetadata: {
        demographic?: string;  // Use optional chaining here
        gender?: string;
    };
}

export type DocumentData = {
    title: string;
    admins: string[];
    members: string[];
    // Add other fields as necessary
}


export interface Task {
    id: string
    title: string
    column: string
    assigned: Array<string>
    date: string
  }