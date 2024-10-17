'use server'
import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

// IMPLEMENT THIS WITH FIREBASE FIRESTORE NOW THAT WE AREN'T USING LIVE BLOCKS


export async function createNewDocument() {
    auth().protect();

    const { sessionClaims } = await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    })

    await adminDb.collection('users').doc(sessionClaims?.email!).collection
    ('rooms').doc(docRef.id).set({
        userId : sessionClaims?.email!, 
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id
    })
    return { docId: docRef.id }
}


export async function deleteDocument(roomId: string){
    auth().protect(); // ensure the user is authenticated

    console.log("deleteDocument", roomId);

    try{
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
        .collectionGroup("rooms")
        .where("roomId", "==", roomId)
        .get();

        const batch = adminDb.batch();
        // delete the room reference in teh user's collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        })


        return { success:true }
    } catch (error) {
        console.error(error);
        return { success: false}
    }
}

export async function inviteUserToDocument(roomId: string, email: string) {
    auth().protect();

    console.log("inviteUserToDocument", roomId, email);

    try {
        await adminDb
        .collection("users")
        .doc(email)
        .collection("rooms")
        .doc(roomId)
        .set({
            userId: email,
            role: "editor",
            createdAt: new Date(),
            roomId,
        })

        return { success: true};
    } catch (error) { 
        console.error(error);
        return {success: false};
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

  export async function deleteTask(roomId: string, taskId: string) {
    auth().protect(); // ensure the user is authenticated
  
    console.log("deleteTask", roomId, taskId);
  
    try {
      await adminDb
        .collection("documents")
        .doc(roomId)
        .collection("tasks")
        .doc(taskId)
        .delete();
  
      console.log(`Task ${taskId} deleted successfully from room ${roomId}`);
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error);
      return { success: false };
    }
  }