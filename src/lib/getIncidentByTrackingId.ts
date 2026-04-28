import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function getIncidentByTrackingId(id: string) {
  try {
    const cleanId = id.trim();
    const upperId = cleanId.toUpperCase();
    const colRef = collection(db, "incidents");

    // 1. Try trackingId (Standard user-facing format)
    const q = query(colRef, where("trackingId", "==", upperId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const matchDoc = snapshot.docs[0];
      const data = matchDoc.data();
      return {
        id: matchDoc.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    }

    // 2. Fallback: Try exact Firestore doc.id (System reference)
    const docRef = doc(db, "incidents", cleanId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
    }

    return null;

  } catch (error) {
    console.error("Incident retrieval error:", error);
    return null;
  }
}
