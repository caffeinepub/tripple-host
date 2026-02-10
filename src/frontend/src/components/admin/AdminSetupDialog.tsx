import { useState } from 'react';
import { Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClaimFirstAdmin } from '../../hooks/useQueries';

interface AdminSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminSetupDialog({ open, onOpenChange }: AdminSetupDialogProps) {
  const claimAdmin = useClaimFirstAdmin();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSetupAdmin = async () => {
    try {
      await claimAdmin.mutateAsync();
      setShowSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      // Error is handled by mutation state and displayed in the alert below
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Set Up Admin Access</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            No administrators have been configured yet. As the first user, you can claim admin access to manage
            pricing plans, customize website content, and configure site settings.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {claimAdmin.isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {claimAdmin.error instanceof Error
                  ? claimAdmin.error.message
                  : 'Failed to set up admin access. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {showSuccess && (
            <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Admin access successfully configured! The Admin button will now appear in the header.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">What you'll be able to do:</h4>
            <ul className="text-sm text-muted-foreground space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Create and manage pricing plans</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Customize website content and branding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Upload and manage the site logo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Manage admin access for other users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Access the admin control panel</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={claimAdmin.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSetupAdmin}
            disabled={claimAdmin.isPending || showSuccess}
            className="gap-2"
          >
            {claimAdmin.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Setting up...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Success!
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Claim Admin Access
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
