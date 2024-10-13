import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";  // 127.2k (gzipped: 38.7k)
import { NextRequest, NextResponse } from "next/server";   // 38.5k (gzipped: 13.8k)

export async function POST(req: NextRequest) {
  auth().protect(); // Ensure the user is authenticated

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });

  const usersInRoom = await adminDb
  .collectionGroup("rooms")
  .where("userId", "==", sessionClaims?.email)
  .get();

  const userInRoom = usersInRoom.docs.find((doc)=> doc.id === room )

  if (userInRoom?.exists){
    session.allow(room, session.FULL_ACCESS);
    const {body, status} = await session.authorize();

    console.log("You are authorized")
    return new Response(body, {status});
  } else{
    return NextResponse.json(
        {message: "You are not in this room"},
        {status: 403}
    )
  }
}