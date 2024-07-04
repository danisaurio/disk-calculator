import { addDoc, collection } from "firebase/firestore";
import { initializeDb } from "./firebase";
import { Movement, NewPR } from "./firebase-types";

const db = initializeDb();

export const addNewMovement = async ({ name }: Movement) => {
  try {
    const docRef = await addDoc(collection(db, "movements"), {
      name,
    });
    console.log("Movement written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding movement: ", e);
  }
}

export const addNewRM = async ({ movementId, kgs }: NewPR) => {
  const today = new Date()
  try {
    const docRef = await addDoc(collection(db, "rms"), {
      movementId,
      kgs,
      date: today.toISOString()
    });
    console.log("rm written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding rm: ", e);
  }
}