import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
export function ProfileImage({ src, className = "", ...props }) {
  return (
    <div
      className={`${className} relative h-12 w-12 overflow-hidden rounded-full`}
    >
      {src == null ? (
        <VscAccount></VscAccount>
      ) : (
        <Image src={src} alt="ProfileImage" fill quality={100}></Image>
      )}
    </div>
  );
}
