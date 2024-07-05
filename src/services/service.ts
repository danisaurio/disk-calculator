import { Timestamp, arrayUnion, collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { initializeAuth, initializeDb } from "./firebase";
import { MovementRM, NewWeight } from "./firebase-types";
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";

const db = initializeDb();
const auth = initializeAuth()

export const login = async ({ email, password }: { email: string, password: string }): Promise<string | false> => {
  let response;
  try {
    await setPersistence(auth, browserLocalPersistence);
    response = await signInWithEmailAndPassword(auth, email, password);
    return response.user.uid;
  } catch (err) {
    const error = err as { code: number, message: string };
    console.error(`Error on sign in!: ${error.code}`);
    console.error(error.message);
    return false;
  }
};

export const addNewRM = async ({ movement, kgs }: MovementRM) => {
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

export const getAllRMs = async () => {
  const querySnapshot = await getDocs(collection(db, "movements"));
  const result: Record<string, { kgs: string, date: string }[]> = {}

  querySnapshot.forEach((doc) => {
    const acc = doc.data()
    const rms: [{ kgs: string, date: { seconds: number, nanoseconds: number } }] = acc.rms
    rms.sort((a, b) => (a.date > b.date ? 1 : ((b.date > a.date) ? -1 : 0)))
    result[acc.name] = rms.map((rm: { kgs: string, date: { seconds: number, nanoseconds: number } }) => {
      const date = new Timestamp(rm.date.seconds, rm.date.nanoseconds);
      return { kgs: rm.kgs, date: date.toDate().toDateString() }
    })
  });
  return result
}

export const getWeight = async () => {
  const querySnapshot = await getDocs(collection(db, "weight"));
  let result: { weight: string, date: string } = { weight: '', date: '' }
  querySnapshot.forEach((doc) => {
    const acc = doc.data()
    const date = new Timestamp(acc.date.seconds, acc.date.nanoseconds);
    result = {
      weight: acc.weight,
      date: date.toDate().toDateString()
    }
  });
  return result
}

export const updateWeight = async ({ kgs }: NewWeight) => {
  const frankDocRef = doc(db, "weight", "weight-collection-id");
  await setDoc(frankDocRef, {
    weight: kgs,
    date: serverTimestamp()
  });
}
