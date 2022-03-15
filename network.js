import firebase from "firebase";

export const senderMsg = async (msgValue, currentUserId, guestUserId, img) => {
  try {
    return await firebase
      .database()
      .ref("messeges/" + currentUserId)
      .child(guestUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3J9vtPDCVupM4zSB6IBvw0J9zcE-5Ma4OCA&usqp=CAU",
        },
      });
  } catch (error) {
    return error;
  }
};

export const recieverMsg = async (
  msgValue,
  currentUserId,
  guestUserId,
  img
) => {
  try {
    return await firebase
      .database()
      .ref("messeges/" + guestUserId)
      .child(currentUserId)
      .push({
        messege: {
          sender: currentUserId,
          reciever: guestUserId,
          msg: msgValue,
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3J9vtPDCVupM4zSB6IBvw0J9zcE-5Ma4OCA&usqp=CAU",
        },
      });
  } catch (error) {
    return error;
  }
};
