import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, FileArchive, FileCode } from "lucide-react";


const AddReview = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.name.toLowerCase();
      if (fileType.endsWith('.zip') || fileType.endsWith('.xml') || fileType.endsWith('.json')) {
        setSelectedFile(file);
        toast.success(`File "${file.name}" selected`);
      } else {
        toast.error("Please upload a ZIP, XML, or JSON file");
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const fileText = await selectedFile.text();
      const parsedReviews = JSON.parse(fileText);

      // Step 2: Prepare JSON body
      const payload = {
        batch_name: selectedFile.name,
        reviews: parsedReviews.reviews,
      };

      // Step 3: Send JSON to backend
      const response = await fetch("https://backend-fake-review-detection.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      console.log("Backend response:", data);
      toast.success("File uploaded successfully! Analysis started.");
      navigate("/dashboard/queue");
      
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Invalid or malformed file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Reviews for Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Upload a file containing multiple reviews for batch analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Review File</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="file">Select File (ZIP, XML, or JSON)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".zip,.xml,.json"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
                    {selectedFile.name.endsWith('.zip') ? (
                      <FileArchive className="h-5 w-5 text-primary" />
                    ) : (
                      <FileCode className="h-5 w-5 text-primary" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Supported File Formats
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• ZIP archives containing review data</li>
                    <li>• XML or JSON files with structured review information</li>
                  </ul>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedFile || isUploading}>
                {isUploading ? "Uploading..." : "Upload and Analyze"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddReview;