import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  getDoc,
  where,
  query,
  getDocs,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { deleteUser } from "firebase/auth";
import { db, auth, storage } from "./firebase-setup";
import { getRandomImageFromNASA } from "../external-api/helper";

const defaultAvatar =
  "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/1200px-SpongeBob_SquarePants_character.svg.png";

//users collection

//add a new user to db
export async function addUserToDB(id, email) {
  try {
    await setDoc(doc(db, "users", id), {
      email: email,
      name: "Anonymous",
      avatar: defaultAvatar,
      win: 0,
      lose: 0,
      id: id,
      location: null,
      score: 0,
    });
  } catch (e) {
    console.error("Error happened while adding user to db: ", e);
  }
}

//read a user from db
export async function getUserFromDB(id) {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (e) {
    console.error("Error happened while getting user from db: ", e);
  }
}

//update a user's name in db
export async function updateUserNameInDB(id, newName) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      name: newName,
    });
  } catch (e) {
    console.error("Error happened while updating user's name in db: ", e);
  }
}

//update a user's avatar in db
export async function updateUserAvatarInDB(id, newAvatarUri) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      avatar: newAvatarUri,
    });
  } catch (e) {
    console.error("Error happened while updating user's avatar in db: ", e);
  }
}

//increment a user's score in db
export async function incrementUserScoreInDB(id) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      score: increment(1),
    });
  } catch (e) {
    console.error("Error happened while incrementing user's score in db: ", e);
  }
}

//decrement a user's score in db
export async function decrementUserScoreInDB(id) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      score: increment(-1),
    });
  } catch (e) {
    console.error("Error happened while decrementing user's score in db: ", e);
  }
}

//increment a user's win in db
export async function incrementUserWinInDB(id) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      win: increment(1),
    });
    await incrementUserScoreInDB(id);
  } catch (e) {
    console.error("Error happened while incrementing user's win in db: ", e);
  }
}

//increment a user's lose in db
export async function incrementUserLoseInDB(id) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      lose: increment(1),
    });
    await decrementUserScoreInDB(id);
  } catch (e) {
    console.error("Error happened while incrementing user's lose in db: ", e);
  }
}

//update a user's location in db
export async function updateUserLocationInDB(id, newLocation) {
  try {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      location: newLocation,
    });
  } catch (e) {
    console.error("Error happened while updating user's location in db: ", e);
  }
}

//delete a user from db
export async function deleteUserFromDB(id) {
  try {
    await deleteDoc(doc(db, "users", id));
  } catch (e) {
    console.error("Error happened while deleting user from db: ", e);
  }
}

//puzzles collection

//add a new puzzle to db
export async function addPuzzleToDB(puzzle, userId) {
  try {
    const coverImageUri = await getRandomImageFromNASA();

    if (!coverImageUri) {
      throw new Error("Unable to get random image from NASA API.");
    }

    await addDoc(collection(db, "puzzles"), {
      puzzle: puzzle,
      userId: userId,
      coverImageUri: coverImageUri,
      win: 0,
      lose: 0,
      winners: [],
    });
  } catch (e) {
    console.error("Error happened while adding puzzle to db: ", e);
  }
}

//read a single puzzle from db using userId
export async function getPuzzleFromDB(userId) {
  try {
    const q = query(collection(db, "puzzles"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    if (doc) {
      return { ...doc.data(), id: doc.id };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error happened while getting puzzle from db: ", e);
  }
}

//update a puzzle in db
export async function updatePuzzleInDB(id, newPuzzle) {
  try {
    const newCoverImageUri = await getRandomImageFromNASA();
    if (!newCoverImageUri) {
      throw new Error("Unable to get random image from NASA API.");
    }

    const docRef = doc(db, "puzzles", id);

    await updateDoc(docRef, {
      coverImageUri: newCoverImageUri,
      puzzle: newPuzzle,
      win: 0,
      lose: 0,
      winners: [],
    });
  } catch (e) {
    console.error("Error happened while updating puzzle in db: ", e);
  }
}

//increment a puzzle's win in db
export async function incrementPuzzleWinInDB(id, designerId) {
  try {
    const docRef = doc(db, "puzzles", id);
    await updateDoc(docRef, {
      win: increment(1),
    });
    await incrementUserScoreInDB(designerId);
  } catch (e) {
    console.error("Error happened while incrementing puzzle's win in db: ", e);
  }
}

//increment a puzzle's lose in db
export async function incrementPuzzleLoseInDB(id, designerId, winnerId) {
  try {
    const docRef = doc(db, "puzzles", id);
    await updateDoc(docRef, {
      lose: increment(1),
      winners: arrayUnion(winnerId),
    });
    await decrementUserScoreInDB(designerId);
  } catch (e) {
    console.error("Error happened while incrementing puzzle's lose in db: ", e);
  }
}

//delete a puzzle from db
export async function deletePuzzleFromDB(id) {
  try {
    await deleteDoc(doc(db, "puzzles", id));
  } catch (e) {
    console.error("Error happened while deleting puzzle from db: ", e);
  }
}

//activities collection

//add a new activity to db
export async function addActivityToDB(title, imageUri, intro, organizer, date) {
  try {
    await addDoc(collection(db, "activities"), {
      title: title,
      imageUri: imageUri,
      intro: intro,
      organizer: organizer,
      date: date,
      participants: [organizer],
      usersToRemind: [],
    });
  } catch (e) {
    console.error("Error happened while adding activity to db: ", e);
  }
}

//read a single activity from db using user id
export async function getActivityFromDB(userId) {
  try {
    const q = query(
      collection(db, "activities"),
      where("organizer", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const doc = querySnapshot.docs[0];
    if (doc) {
      return { ...doc.data(), id: doc.id };
    } else {
      return null;
    }
  } catch (e) {
    console.error(
      "Error happened while getting a user's activity from db: ",
      e
    );
  }
}

//update an activity in db
export async function updateActivityInDB(
  activityId,
  title,
  imageUri,
  intro,
  date,
  usersToRemind
) {
  try {
    const docRef = doc(db, "activities", activityId);
    await updateDoc(docRef, {
      title: title,
      imageUri: imageUri,
      intro: intro,
      date: date,
      usersToRemind: usersToRemind,
    });
  } catch (e) {
    console.error("Error happened while updating activity in db: ", e);
  }
}

//add a participant to an activity in db
export async function addParticipantToActivityInDB(activityId, participantId) {
  try {
    const docRef = doc(db, "activities", activityId);
    await updateDoc(docRef, {
      participants: arrayUnion(participantId),
    });
  } catch (e) {
    console.error(
      "Error happened while adding participant to activity in db: ",
      e
    );
  }
}

//add a user to usersToRemind in an activity in db
export async function addUserToUsersToRemindInActivityInDB(activityId, userId) {
  try {
    const docRef = doc(db, "activities", activityId);
    await updateDoc(docRef, {
      usersToRemind: arrayUnion(userId),
    });
  } catch (e) {
    console.error(
      "Error happened while adding user to usersToRemind in activity in db: ",
      e
    );
  }
}

//remove a participant from an activity in db
export async function removeParticipantFromActivityInDB(
  activityId,
  participantId
) {
  try {
    const docRef = doc(db, "activities", activityId);
    await updateDoc(docRef, {
      participants: arrayRemove(participantId),
    });
  } catch (e) {
    console.error(
      "Error happened while removing participant from activity in db: ",
      e
    );
  }
}

//delete an activity from db
export async function deleteActivityFromDB(activityId) {
  try {
    await deleteDoc(doc(db, "activities", activityId));
  } catch (e) {
    console.error("Error happened while deleting activity from db: ", e);
  }
}

//storage

//delete a user's avatar image from storage
export async function deleteUserAvatarImageFromStorage(userId) {
  try {
    const userAvatarRef = ref(storage, `avatars/${userId}`);
    await deleteObject(userAvatarRef);
  } catch (e) {
    console.log(
      "<No Panic Needed> Avatar image not deleted from storage because: ",
      e
    );
  }
}

//delete a user's activity cover image from storage
export async function deleteUserActivityImageFromStorage(userId) {
  try {
    const activityCoverImageRef = ref(storage, `activities/${userId}`);
    await deleteObject(activityCoverImageRef);
  } catch (e) {
    console.log(
      "<No Panic Needed> Activity cover image not deleted from storage because: ",
      e
    );
  }
}

//account

//delete a user's account
export async function deleteUserAccount() {
  try {
    const user = auth.currentUser;
    await deleteUser(user);
  } catch (e) {
    console.error("Error happened while deleting user account: ", e);
  }
}
