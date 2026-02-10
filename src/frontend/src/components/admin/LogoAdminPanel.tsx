import { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useGetLogo, useUpdateLogo } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';

export default function LogoAdminPanel() {
  const { data: currentLogo, isLoading } = useGetLogo();
  const updateMutation = useUpdateLogo();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLogoUrl = currentLogo?.getDirectURL();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 5MB');
      return;
    }

    setSuccessMessage(null);
    setErrorMessage(null);
    setUploadProgress(0);

    try {
      // Read file as bytes
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create preview
      const blob = new Blob([bytes], { type: file.type });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Create ExternalBlob with progress tracking
      const externalBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      // Upload to backend
      await updateMutation.mutateAsync(externalBlob);

      setSuccessMessage('Logo updated successfully!');
      setUploadProgress(0);
      setTimeout(() => {
        setSuccessMessage(null);
        setPreviewUrl(null);
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload logo. Please try again.');
      setUploadProgress(0);
      setPreviewUrl(null);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Logo</CardTitle>
          <CardDescription>
            This logo appears in the header and footer of your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : currentLogoUrl ? (
            <div className="flex items-center justify-center p-8 bg-accent/20 rounded-lg border border-border">
              <img
                src={currentLogoUrl}
                alt="Current logo"
                className="max-h-32 w-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No custom logo uploaded. Using default logo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Logo</CardTitle>
          <CardDescription>
            Upload a PNG, JPG, or other image file (max 5MB). Recommended size: 512x256px or similar aspect ratio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {previewUrl && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="flex items-center justify-center p-8 bg-accent/20 rounded-lg border border-border">
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="max-h-32 w-auto"
                />
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="logo-upload"
            />
            <Button
              type="button"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Choose Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
