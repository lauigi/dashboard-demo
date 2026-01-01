import { Button } from '@workspace/ui/components/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// https://github.com/shadcn-ui/ui/issues/494#issuecomment-2827352653
export default function DeleteConfirmBtn({ type: _type }: { type?: string }) {
  return (
    <>
      <Button
        onClick={() => {
          toast.error('Not implemented');
        }}
        variant="destructive"
        size="sm"
      >
        <Trash2 />
        Delete
      </Button>
    </>
  );
}
