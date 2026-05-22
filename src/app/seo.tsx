"use client";
import { useEffect } from "react";

// Custom hook to dynamically set the document title per page
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
