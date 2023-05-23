import { useSession } from "next-auth/react";
import { useLayoutEffect, useState, useRef, useCallback } from "react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import { api } from "~/utils/api";

export function NewTweetForm() {
  const sesssion = useSession();
  const [inputValue, setInputValue] = useState("");
  //chinh chieu cao o nhap post
  function updateTextareaHeight(textArea) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
  const textAreaRef = useRef();
  const inputRef = useCallback((textArea) => {
    updateTextareaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);
  //submit post
  const trpc = api.useContext();
  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      trpc.tweet.InfFeed.setInfiniteData({}, (oldData) => {
        if (sesssion.status !== "authenticated") return;
        if (oldData == null || oldData.pages[0] == null) return;
        const newCacheTweets = {
          ...newTweet,
          likesCount: { likes: 0 },
          likeByMe: false,
          user: {
            id: sesssion.data.user.id,
            name: sesssion.data.user.name,
            image: sesssion.data.user.image,
          },
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              mappedTweets: [newCacheTweets, ...oldData.pages[0].mappedTweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
  const onSubmit = (e) => {
    e?.preventDefault();
    createTweet.mutate({ content: inputValue });
    setInputValue("");
  };
  useLayoutEffect(() => {
    updateTextareaHeight(textAreaRef.current);
  }, [inputValue]);
  if (sesssion.status !== "authenticated") return null;
  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex gap-4">
        {sesssion.data && (
          <ProfileImage src={sesssion.data.user.image}></ProfileImage>
        )}
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="Say something intersting"
        ></textarea>
      </div>
      <Button className="self-end px-12" onClick={onSubmit}>
        Post
      </Button>
    </form>
  );
}
