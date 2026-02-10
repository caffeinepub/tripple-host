import { AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminAccessDeniedProps {
  onClose: () => void;
  adminsExist: boolean;
}

export default function AdminAccessDenied({ onClose, adminsExist }: AdminAccessDeniedProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground">
            You do not have permission to access the admin panel.
          </p>

          {adminsExist ? (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Admin access is required</p>
                  <p className="text-muted-foreground">
                    Please contact an existing administrator to request admin privileges for your account.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Admin setup required</p>
                  <p className="text-muted-foreground">
                    No administrators have been configured yet. Look for the "Set up admin access" button in the
                    header to claim admin privileges.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={onClose}
          className="w-full"
          size="lg"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
