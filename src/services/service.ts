import { Timestamp, arrayUnion, collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { initializeDb } from "./firebase";
import { AllRMs, MovementFirebaseResponse, MovementRMRequest, NewWeightRequest, WeightFirebaseResponse, WeightWithDateString } from "./firebase-types";

const db = initializeDb();

export const addNewRM = async ({ movement, kgs }: MovementRMRequest) => {
  try {
    const docRef = doc(db, "movements", movement);
    await updateDoc(docRef, {
      rms: arrayUnion({ kgs, date: new Date() })
    });
    console.log("Movement written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding movement: ", e);
  }
}

export const createNewRMDoc = async ({ movement, kgs }: MovementRMRequest) => {
  try {
    const docRef = doc(db, "movements", movement);
    await setDoc(docRef, {
      name: movement,
      rms: arrayUnion({ kgs, date: new Date() })
    });
    console.log("Movement written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding movement: ", e);
  }
}

export const getAllRMs = async (): Promise<AllRMs> => {
  const querySnapshot = await getDocs(collection(db, "movements"));
  const result: AllRMs = {}
  querySnapshot.forEach((doc) => {
    const acc = doc.data() as MovementFirebaseResponse
    const rms = acc.rms
    rms.sort((a, b) => (a.date > b.date ? 1 : ((b.date > a.date) ? -1 : 0)))
    result[acc.name] = rms.map((rm) => {
      const date = new Timestamp(rm.date.seconds, rm.date.nanoseconds);
      return { kgs: rm.kgs, date: date.toDate().toDateString() }
    })
  });
  return result
}

export const getWeight = async () => {
  const querySnapshot = await getDocs(collection(db, "weight"));
  let result = {} as WeightWithDateString
  querySnapshot.forEach((doc) => {
    const acc = doc.data() as WeightFirebaseResponse
    const date = new Timestamp(acc.date.seconds, acc.date.nanoseconds);
    result = {
      weight: acc.weight,
      date: date.toDate().toDateString()
    }
  });
  return result
}

export const updateWeight = async ({ kgs }: NewWeightRequest) => {
  const docRef = doc(db, "weight", "weight-collection-id");
  await setDoc(docRef, {
    weight: kgs,
    date: serverTimestamp()
  });
}
