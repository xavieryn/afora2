import { DocumentData } from "firebase/firestore";

/**
 * - editor: members who can edit the documents
 * - admin: administrators who have higher access 
 */
export const access_roles: string[] = ['editor', 'admin'];

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

export type ProjectData = {
    title: string;
    admins: string[];
    members: string[];
    // Add other fields as necessary
}

export type Task = {
    id: string;
    title: string;
    // Add other fields as necessary
}

export type Organization = {
    title: string;
    description: string;
    admins: string[];
    members: string[];
}

// this structure describes the subcollection 'org' document under each user
// orgId and userId are not repetitive and are needed for quick query when deleting organizations
export interface UserOrgData extends DocumentData {
    role: string;
    orgId: string;
    userId: string;
}