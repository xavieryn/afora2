'use server'
import { db } from "@/firebase";
import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import { query, collection, where, getDocs } from "firebase/firestore";

// IMPLEMENT THIS WITH FIREBASE FIRESTORE NOW THAT WE AREN'T USING LIVE BLOCKS


export async function createNewDocument() {
    auth().protect();

    const { sessionClaims } = await auth();
    const userId = sessionClaims?.email!;

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc",
        admins: [userId],
        members: []
    })

    await adminDb.collection('users').doc(userId).collection
        ('rooms').doc(docRef.id).set({
            userId: userId,
            role: "owner",
            createdAt: new Date(),
            roomId: docRef.id
        })
    return { docId: docRef.id }
}


export async function deleteDocument(roomId: string) {
    auth().protect(); // ensure the user is authenticated

    console.log("deleteDocument", roomId);

    try {
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch();
        // delete the room reference in the user's collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        })


        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}

export async function inviteUserToDocument(roomId: string, email: string, access: string) {
    // TODO: this seems to lead to refresh/redirect of pages regardless of success or not
    // auth().protect();

    console.log("inviteUserToDocument", roomId, email);

    try {
        roomId = roomId.trim();
        if (!roomId) {
            throw new Error('Doccument id cannot be empty');
        }

        const docSnapshot = await adminDb.collection("documents").doc(roomId).get();

        // Check if the document exists
        if (!docSnapshot.exists) {
            throw new Error(`Document with id ${roomId} not found`);
        }

        // Check if the user is already a member of the document
        const documentData = docSnapshot.data();
        const members = documentData?.members || [];
        const admins = documentData?.admins || [];

        if (members.includes(email) || admins.includes(email)) {
            throw new Error(`You are already a member of the document`);
        }

        // Add the user to the document's members array
        await adminDb.collection("documents").doc(roomId).set(
            (access === 'editor') ? { members: [...members, email] } : { admins: [...admins, email] }, // append the new email to the corresponding array
            { merge: true } // use merge to only update the members field without overwriting the document
        );

        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: access,
                createdAt: new Date(),
                roomId,
            })

        return { success: true, message: 'success' };
    } catch (error) {
        console.error(error);
        return { success: false, message: (error as Error).message };
    }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    auth().protect(); // Ensure the user is authenticated

    console.log("removeUserFromDocument", roomId, email);

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete();

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function createNewOrganization() {
    auth().protect();

    try {
        const { sessionClaims } = await auth();
        const userId = sessionClaims!.email!;
        if (!userId) {
            throw new Error('Current user not authenticated or invalid email');
        }

        const docCollectionRef = adminDb.collection("organizations");
        const docRef = await docCollectionRef.add({
            title: "New Org",
            admins: [userId],
            members: []
        })

        await adminDb.collection('users').doc(userId).collection
            ('orgs').doc(docRef.id).set({
                userId: userId,
                role: "admin",
                createdAt: new Date(),
                orgId: docRef.id
            })
        return { orgId: docRef.id, success: true };
    } catch (e) {
        return { success: false, message: (e as Error).message }
    }
}

export async function deleteOrg(orgId: string) {
    auth().protect(); // ensure the user is authenticated

    console.log(orgId);
    try {
        
        await adminDb.collection("organizations").doc(orgId).delete();

        const query = await adminDb
            .collectionGroup("orgs")
            .where("orgId", "==", orgId)
            .get();

        const batch = adminDb.batch();
        // delete the organization reference in the user's collection for every user in the organization
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}