import { useSession } from "next-auth/react";
import { useLayoutEffect, useState, useRef, useCallback } from "react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";
import { api } from "~/utils/api";

export function NewTweetForm() {
  const session = useSession();

  const [inputValue, setInputValue] = useState("");
  //chinh chieu cao o nhap post
  function updateTextareaHeight(textArea: HTMLTextAreaElement | undefined) {
    if (textArea == null) return;
    textArea.style.height = "0";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextareaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);
  //submit post
  const trpc = api.useContext();

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");

      if (session.status !== "authenticated") return;

      trpc.tweet.InfFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likesCount: { likes: 0 },
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              mappedTweets: [newCacheTweet, ...oldData.pages[0].mappedTweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
  const onSubmit = (event: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault();
    createTweet.mutate({ content: inputValue });
    setInputValue("");
  };
  useLayoutEffect(() => {
    updateTextareaHeight(textAreaRef.current);
  }, [inputValue]);
  if (session.status !== "authenticated") return null;
  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex gap-4">
        {session.data && (
          <ProfileImage
            src={session.data.user.image}
            className={""}
          ></ProfileImage>
        )}
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="Say something intersting"
        ></textarea>
      </div>
      <Button
        className="self-end px-12"
        onClick={onSubmit}
        small={false}
        gray={false}
      >
        Post
      </Button>
    </form>
  );
}
