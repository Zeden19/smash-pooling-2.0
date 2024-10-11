"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message as MessageType, User } from "prisma/prisma-client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import FailureToast from "@/components/FailureToast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Props {
  message: MessageType;
  currentUser: User;
  chatroomUsers: User[];
  removeMessage: (message: MessageType) => void;
  editMessage: (message: MessageType) => void;
}

function Message({
  message,
  currentUser,
  chatroomUsers,
  removeMessage,
  editMessage,
}: Props) {
  const isCurrentUser = message.userId === currentUser.id;
  const [isHovering, setIsHovering] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const editedMessage = useRef<HTMLInputElement>(null);

  async function remove() {
    setDeleteLoading(true);
    try {
      const { data } = await axios.delete("/api/chat", {
        data: { message },
      });
      removeMessage(data.deletedMessage);
      setDeleteLoading(false);
    } catch (e) {
      console.log(e);
      FailureToast("Could not delete message");
      setDeleteLoading(false);
    }
  }

  async function edit() {
    setEditLoading(true);
    try {
      const { data } = await axios.patch("/api/chat", {
        message: { ...message, content: editedMessage.current!.value, edited: true },
      });
      editMessage(data.editedMessage);
      setEditLoading(false);
      setOpen(false);
    } catch (e) {
      console.log(e);
      FailureToast("Could not delete message");
      setDeleteLoading(false);
      setEditLoading(false);
    }
  }

  const messageAuthor = chatroomUsers.find((user) => user.id === message.userId);
  return (
    <>
      {message.serverMessage ? (
        <span
          className={
            "self-center bg-white rounded-xl border-slate-800 text-black p-2 mb-2"
          }>
          {message.content}
        </span>
      ) : (
        <div
          className={`flex gap-2 w-full px-2 rounded-lg ${!isCurrentUser && "justify-end"} ${isHovering && "bg-slate-800"} relative`}
          onMouseOver={() => setIsHovering(true)}
          onMouseOut={() => setIsHovering(false)}>
          {isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarImage src={messageAuthor!.profilePicture} />
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}

          <div className={"flex flex-col gap-1"}>
            <span className={"text-gray-400 text-xs"}>{messageAuthor!.gamertag}</span>
            <span
              className={`self-end mb-1 bg-slate-500 border border-slate-800 p-2 rounded-xl ${isCurrentUser ? "mr-auto" : "ml-auto"}`}>
              {message.content}
            </span>
          </div>
          {message.edited && (
            <span className={"text-xs text-gray-500 italic bold self-end"}>Edited</span>
          )}

          {!isCurrentUser ? (
            <Avatar className={"mt-2.5"}>
              <AvatarImage src={messageAuthor!.profilePicture} />
              <AvatarFallback>{messageAuthor!.gamertag.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : null}

          {isHovering && message.userId === currentUser.id && (
            <div
              className={
                "absolute top-[-17px] right-3 flex ml-auto gap-1 mb-1 overflow-visible"
              }>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button size={"smallIcon"} disabled={deleteLoading}>
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this message? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={remove}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button size={"smallIcon"} disabled={deleteLoading}>
                    <Pencil />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Message</DialogTitle>
                    <DialogDescription>Enter the edited message</DialogDescription>
                  </DialogHeader>
                  <div className={"flex flex-col gap-2"}>
                    <Label htmlFor={"newMessage"}>New Message</Label>
                    <Input
                      ref={editedMessage}
                      defaultValue={message.content}
                      id={"newMessage"}
                    />
                    <Button className={"w-1/4"} onClick={() => edit()}>
                      Send
                      {editLoading && <LoadingSpinner />}
                    </Button>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"secondary"}>Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Message;
