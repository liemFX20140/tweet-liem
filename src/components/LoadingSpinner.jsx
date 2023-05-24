import { VscRefresh } from "react-icons/vsc";

export function LoadingSpinner(big = false) {
  return (
    <div className="flex justify-center p-2">
      <VscRefresh className={`animate-spin ${big ? "h-16 w-16" : "h-4 w-4"}`} />
    </div>
  );
}
