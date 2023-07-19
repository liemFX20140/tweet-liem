import { useSession } from "next-auth/react";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { VscFileMedia } from "react-icons/vsc";
import type { ChangeEvent } from "react";
import { content } from "googleapis/build/src/apis/content";
import { get } from "http";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return null;

  return <Form />;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const imageRef = useRef<HTMLInputElement>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [file, setFile] = useState<File>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useContext();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue("");
      setImageBlob(null);
      if (newTweet == null) return;
      if (session.status !== "authenticated") return;

      trpcUtils.tweet.InfFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          id: newTweet.id,
          content: newTweet.content,
          createdAt: newTweet.createdAt,
          likesCount: { likes: 0 },
          likeByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
          media: null,
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
  const getPresigndUrl = api.photo.getPresigndUrl.useMutation({});

  if (session.status !== "authenticated") return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (file == null) {
      createTweet.mutate({ content: inputValue });
      return;
    }
    getPresigndUrl.mutate();

    if (getPresigndUrl.data == null) return;
    await fetch(getPresigndUrl.data.url, {
      method: "PUT",
      body: file,
    });

    createTweet.mutate({ content: inputValue, media: getPresigndUrl.data.key });
  };
  const handleImageChose = (event: FormEvent) => {
    imageRef.current?.click();
  };
  const handleImageInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files == null) return;
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    if (event.target.files[0] == undefined) return;
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const image = new Image();
      image.src = reader.result ? reader.result?.toString() : "";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0);
        canvas.toBlob(
          (blob) => {
            setImageBlob(blob);
          },
          "image/jpeg",
          0.95
        );
      };
    };
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex flex-grow gap-4">
        <ProfileImage src={session.data.user.image} className="" />
        <div className="flex w-4/5 flex-col">
          <textarea
            ref={inputRef}
            style={{ height: 0 }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="What's happening?"
          ></textarea>
          {imageBlob && (
            <img src={URL.createObjectURL(imageBlob)} alt="uploaded image" />
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="ml-2">
          <label>
            <VscFileMedia
              className="h-6 w-6"
              onClick={handleImageChose}
            ></VscFileMedia>
          </label>
          <input
            ref={imageRef}
            type="file"
            accept="image"
            onChange={handleImageInputChange}
            style={{ display: "none" }}
          ></input>
        </div>
        <Button className="" type="submit">
          Tweet
        </Button>
      </div>
    </form>
  );
}
