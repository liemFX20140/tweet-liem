import { Button } from "./Button";
import { useSession } from "next-auth/react";
type Props = {
  userId: string;
  isFollowing: boolean;
  onClickButton: () => void;
};

export function FollowingButton({ userId, isFollowing, onClickButton }: Props) {
  const session = useSession();
  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;
  return (
    <Button onClick={onClickButton} small gray={isFollowing} className="">
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
