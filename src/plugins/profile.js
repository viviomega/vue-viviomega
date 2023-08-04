import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default async (id) => {
  const state = {
    name: "",
    birthday: "",
    gender: null,
    pr: "",
    icon: null,
  };

  // DBからデータ取得
  const docRef = doc(db, "profile", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // 成功時の処理
    console.log("Document data:", docSnap.data());

    // プロフィールデータを設定
    state.name = docSnap.data().name;
    state.birthday = docSnap.data().birthday;
    state.gender = docSnap.data().gender;
    state.pr = docSnap.data().pr;
    state.icon = docSnap.data().icon;

    return state;
  } else {
    // 失敗時の処理
    console.log("No such document!", docSnap.exists());
    return null;
  }
};
