import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function errorToast(error: unknown) {
  toast({
    variant: "destructive",
    title: "Uh oh! Something went wrong.",
    description:
      (error instanceof AxiosError && error.response?.data?.message) ??
      "There was a problem with your request.",
  });
}
