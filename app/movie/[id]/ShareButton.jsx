"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton() {
  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check this out!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-full border-gray-600 text-white hover:bg-gray-800 hidden md:flex"
      onClick={handleShare}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}
