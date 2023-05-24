import { Button } from "../components/Button";
import { useSession } from "next-auth/react";
export function FollowingButton({ userId, isFollowing, onClickButton }) {
  const session = useSession();
  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;
  return (
    <Button onClickButton={onClickButton} small gray={isFollowing}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
