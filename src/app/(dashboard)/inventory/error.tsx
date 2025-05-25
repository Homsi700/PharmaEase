"use client"; 

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
      <h2 className="text-2xl font-semibold text-destructive mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-2">{error.message || "An unexpected error occurred in the inventory section."}</p>
      {error.digest && <p className="text-sm text-muted-foreground mb-6">Error Digest: {error.digest}</p>}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
