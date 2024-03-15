import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import {
  collection,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
  where,
  or,
} from "firebase/firestore";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { auth, db } from "../../APIs/firebase";
import { MessageItem } from "./Components/MessageItem";
import { ProgressIndicator } from "../../components/ProgressIndicator";

const Chat = () => {
  const { USERS, getUserName } = useOutletContext();
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;
  const { receiverID } = useParams();

  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [messageText, setMessageText] = useState("");
  const [groupedMessagesState, setGroupedMessagesState] = useState();
  const [isOnline, setIsOnline] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [unread, setUnread] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState(false);
  const [loggedInUserNameDP, setLoggedInUserNameDP] = useState("");

  const bottomRef = useRef();
  const receiverRef = collection(db, `messages/${receiverID}/messages`);
  const senderRef = collection(db, `messages/${uid}/messages`);

  const q = query(
    userName ? senderRef : receiverRef,
    or(
      where("senderID.uid", "==", `${receiverID}`),
      where("receiverID.uid", "==", `${receiverID}`)
    ),
    orderBy("sentAt", "asc")
  );
  const [MessagesBtnTheTwoUsers, loading, error, snapshot] =
    useCollectionData(q);

  useEffect(() => {
    !loading && handleScrollToBottom();
  }, [loading]);
  const addData = async () => {
    uid &&
      receiverID &&
      loggedInUserName &&
      messageText &&
      (await addMessageToBothSides());

    //store message on both sender and receiver side
    async function addMessageToBothSides() {
      const MessageObject = {
        sentAt: serverTimestamp(),
        senderID: { uid: uid, name: loggedInUserName },
        receiverID: { uid: receiverID, name: userName },
        message: messageText,
      };

      await addDoc(senderRef, MessageObject); //sender
      console.log("Senders Document successfully written!");

      await addDoc(receiverRef, MessageObject); //receiver
      console.log("Receivers Document successfully written!");
    }
  };

  const handleScrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addData();
    setMessageText("");
    handleScrollToBottom();
  };

  const getOnlineStatus = async () => {
    const user = USERS?.find((user) => user.uid === receiverID);
    setIsOnline(user?.is_online);
  };

  // Function to group messages by date
  const groupMessagesByDate = (messageList) => {
    const groupedMessages = [];
    let currentDate = null;

    messageList?.forEach((message) => {
      const messageDate = new Date(message.sentAt?.toDate()).toDateString();
      if (messageDate !== currentDate) {
        groupedMessages.push({
          sentAt: messageDate,
          messages: [message],
        });
        currentDate = messageDate;
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(message);
      }
    });
    return groupedMessages;
  };

  // Group the messages by date
  useEffect(() => {
    const groupedMessages = groupMessagesByDate(MessagesBtnTheTwoUsers);
    setGroupedMessagesState(groupedMessages);
    getOnlineStatus();
    getUserName(receiverID, setUserName, setProfilePic);
    getUserName(uid, setLoggedInUserName, setLoggedInUserNameDP);
    userName ? setUserType("user") : setUserType("group");
    error && console.log(error);
  }, [MessagesBtnTheTwoUsers]);

  useEffect(() => {
    handleScrollToBottom();
  }, [groupedMessagesState]);

  const handleLastMessage = () => {
    // if (!MessagesBtnTheTwoUsers) return;
    // setUnread("");
    // const lastMsg = MessagesBtnTheTwoUsers[MessagesBtnTheTwoUsers.length - 1];
    // if (lastMessage !== lastMsg) {
    //   setUnread("there is a new message");
    //   setLastMessage(null);
    //   if (lastMsg?.senderID.uid !== uid) {
    //     // handleNotification();
    //     setLastMessage(lastMsg);
    //     console.log(lastMsg, "lastMessage");
    //   }
    // }
    handleScrollToBottom();
  };

  const handleNotification = () => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification("You have a new message!", {
          body: lastMessage?.message || "No message",
          icon: "https://i.imgur.com/2gWZv9S.png",
        });
        notification.onclick = (e) => {
          navigate(`/chatpage/${receiverID}`);
        };
      }
    });
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center p-1 bg-primary/5">
        <Avatar src={profilePic} className="m-1" alt="DP" />
        <div className="flex flex-col justify-center items-start m-2 flex-1">
          <p className="text-white">{userName ? userName : receiverID}</p>
          {userName && (
            <p className="text-white/50 text-sm">
              {isOnline == true ? "online" : "offline"}
            </p>
          )}
        </div>
      </div>
      {/* message items */}
      <div className="chatContainer mb-6 ">
        {!loading ? (
          <>
            {groupedMessagesState?.map((group, index) => (
              <div key={index} className="w-full flex flex-col">
                {group?.sentAt && (
                  <p className="text-center text-xs text-white/50">
                    {group.sentAt}
                  </p>
                )}
                {group?.messages.map((message, index) => {
                  const senderID = message.senderID.uid;
                  const name = message.senderID.name;

                  const timeSent = message.sentAt
                    ?.toDate()
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  const hideSender = senderID === uid ? "hidden" : null;
                  const messageClass =
                    senderID === uid ? "sender-chat" : "receiver-chat";
                  return (
                    <MessageItem
                      key={index}
                      name={name}
                      userType={userType}
                      messageItem={message.message}
                      profilePic={profilePic}
                      hideSender={hideSender}
                      sentAT={timeSent}
                      messageClass={messageClass}
                    />
                  );
                })}
              </div>
            ))}
            <p>
              {lastMessage?.message} {unread}
            </p>
          </>
        ) : (
          <ProgressIndicator />
        )}
        <span ref={bottomRef}></span>
      </div>

      <form
        className="bg-[#121616] flex flex-row w-full absolute bottom-0 justify-between items-center p-3 space-x-1"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Message"
          placeholder="Type your message here"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          margin="none"
          className="flex-1 rounded-sm m-1"
          size="small"
          required
          autoFocus={true}
          autoComplete="off"
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
    </>
  );
};

export default Chat;
