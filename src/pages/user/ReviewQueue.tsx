import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Clock, FileArchive, FileCode, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ReviewQueue = () => {
  const handleRemoveBatch = (id: number, filename: string) => {
    toast.success(`Removed ${filename} from queue`);
  };

  // Mock pending batch analyses
  const pendingBatches = [
    {
      id: 1,
      filename: "product_reviews.xml",
      totalReviews: 95,
      uploadDate: "2024-01-15 14:32",
      status: "pending" as const,
      fileType: "xml",
    },
    {
      id: 2,
      filename: "reviews_batch_03.zip",
      totalReviews: 180,
      uploadDate: "2024-01-15 10:15",
      status: "pending" as const,
      fileType: "zip",
    },
    {
      id: 3,
      filename: "customer_feedback.xml",
      totalReviews: 67,
      uploadDate: "2024-01-14 16:45",
      status: "pending" as const,
      fileType: "xml",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analysis Queue</h1>
          <p className="text-muted-foreground mt-1">
            Batch files pending AI analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Batches ({pendingBatches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {batch.fileType === "zip" ? (
                        <FileArchive className="h-5 w-5 text-primary mt-0.5" />
                      ) : (
                        <FileCode className="h-5 w-5 text-primary mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <h3 className="font-semibold">{batch.filename}</h3>
                        <p className="text-sm text-muted-foreground">
                          {batch.totalReviews} reviews • Uploaded {batch.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Badge status={batch.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 animate-pulse" />
                      <span>Processing... This may take a few minutes</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveBatch(batch.id, batch.filename)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewQueue;
