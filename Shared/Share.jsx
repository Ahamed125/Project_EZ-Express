// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { db } from "../Config/Firebaseonfig";

// export const GetFavList=async(user)=>{

//     //Try to read the user's favorites document:
//     const docSnap=await getDoc(doc(db,'UserFavItems',user?.primaryEmailAddress?.emailAddress));

//     //If it exists → return the data:
//         if(docSnap?.exists())
//         {
//            return docSnap.data();
//         }
//     else{
//     //If it doesn’t exist → create a new document with an empty favorites array:
//         await setDoc(doc(db,'UserFavItems',user?.primaryEmailAddress?.emailAddress),{
//             email:user?.primaryEmailAddress?.emailAddress,
//             favorites:[]

//         })
       
//     }
    
// }
// const UpdateFav=async(user,favorites)=>{
//     const docRef=doc(db,'UserFavItems',user?.primaryEmailAddress?.emailAddress);
//     try{
//         await updateDoc(docRef,{
//             favorites:favorites
//         })
//     }catch(e){

//     }
// }

// export default {
//     GetFavList,
//     UpdateFav
// }
















import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Config/Firebaseonfig";

export const GetFavList = async (user) => {
  if (!user?.primaryEmailAddress?.emailAddress) return { favorites: [] };
  
  const docRef = doc(db, 'UserFavItems', user.primaryEmailAddress.emailAddress);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    await setDoc(docRef, {
      email: user.primaryEmailAddress.emailAddress,
      favorites: []
    });
    return { favorites: [] };
  }
};

export const UpdateFav = async (user, favorites) => {
  if (!user?.primaryEmailAddress?.emailAddress) return;
  
  const docRef = doc(db, 'UserFavItems', user.primaryEmailAddress.emailAddress);
  try {
    await updateDoc(docRef, {
      favorites: favorites
    });
  } catch (e) {
    console.error("Error updating favorites:", e);
  }
};

export default {
  GetFavList,
  UpdateFav
};