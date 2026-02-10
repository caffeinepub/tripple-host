import { useState } from 'react';
import { Shield, UserPlus, Trash2, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGetAdminList, useAddAdmin, useRemoveAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AdminsAdminPanel() {
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const [copiedPrincipal, setCopiedPrincipal] = useState<string | null>(null);
  
  const { identity } = useInternetIdentity();
  const { data: adminList = [], isLoading, isError } = useGetAdminList();
  const addAdmin = useAddAdmin();
  const removeAdmin = useRemoveAdmin();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPrincipal.trim()) return;

    try {
      await addAdmin.mutateAsync(newAdminPrincipal.trim());
      setNewAdminPrincipal('');
    } catch (error) {
      // Error is handled by mutation state
    }
  };

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;

    try {
      await removeAdmin.mutateAsync(adminToRemove);
      setAdminToRemove(null);
    } catch (error) {
      // Error is handled by mutation state
    }
  };

  const handleCopyPrincipal = (principal: string) => {
    navigator.clipboard.writeText(principal);
    setCopiedPrincipal(principal);
    setTimeout(() => setCopiedPrincipal(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Admin Management
          </CardTitle>
          <CardDescription>
            Add or remove administrators who can manage pricing plans, website content, and site settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newAdmin">Add New Administrator</Label>
              <div className="flex gap-2">
                <Input
                  id="newAdmin"
                  placeholder="Enter principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                  value={newAdminPrincipal}
                  onChange={(e) => setNewAdminPrincipal(e.target.value)}
                  disabled={addAdmin.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={addAdmin.isPending || !newAdminPrincipal.trim()}
                  className="gap-2"
                >
                  {addAdmin.isPending ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Add Admin
                    </>
                  )}
                </Button>
              </div>
            </div>

            {addAdmin.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {addAdmin.error instanceof Error
                    ? addAdmin.error.message
                    : 'Failed to add admin. Please check the principal ID and try again.'}
                </AlertDescription>
              </Alert>
            )}

            {addAdmin.isSuccess && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Administrator added successfully!
                </AlertDescription>
              </Alert>
            )}
          </form>

          {/* Admin List */}
          <div className="space-y-3">
            <Label>Current Administrators ({adminList.length})</Label>
            
            {isLoading && (
              <div className="text-sm text-muted-foreground">Loading admin list...</div>
            )}

            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load admin list. You may not have permission to view this information.
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !isError && adminList.length === 0 && (
              <div className="text-sm text-muted-foreground">No administrators found.</div>
            )}

            {!isLoading && !isError && adminList.length > 0 && (
              <div className="space-y-2">
                {adminList.map((principal) => {
                  const isCurrentUser = principal === currentUserPrincipal;
                  const isCopied = copiedPrincipal === principal;
                  
                  return (
                    <div
                      key={principal}
                      className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono truncate block">
                            {principal}
                          </code>
                          {isCurrentUser && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyPrincipal(principal)}
                          className="gap-1.5"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAdminToRemove(principal)}
                          disabled={removeAdmin.isPending}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {removeAdmin.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {removeAdmin.error instanceof Error
                    ? removeAdmin.error.message
                    : 'Failed to remove admin. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Remove Admin Confirmation Dialog */}
      <AlertDialog open={!!adminToRemove} onOpenChange={(open) => !open && setAdminToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this administrator? They will lose access to the admin panel and all
              administrative functions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeAdmin.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              disabled={removeAdmin.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeAdmin.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                'Remove Admin'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
