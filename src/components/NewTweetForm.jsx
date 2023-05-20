import { useSession } from "next-auth/react";
import { useLayoutEffect, useState, useRef, useCallback } from "react";
import { Button } from "~/components/Button";
import { ProfileImage } from "~/components/ProfileImage";

export function NewTweetForm(props) {
  const sesssion = useSession();

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
  const [inputValue, setInputValue] = useState("");

  useLayoutEffect(() => {
    updateTextareaHeight(textAreaRef.current);
  }, [inputValue]);
  if (sesssion.status !== "authenticated") return;
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
      <Button
        className="self-end px-12"
        onClick={(event) => {
          event.preventDefault();
          console.log(event.target);
        }}
      >
        Post
      </Button>
    </form>
  );
}
