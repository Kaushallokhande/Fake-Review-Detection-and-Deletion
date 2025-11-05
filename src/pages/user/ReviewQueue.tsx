import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Clock, FileArchive, FileCode, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Batch {
  _id: string;
  batch_name: string;
  total_reviews: number;
  uploaded_at: string;
  status: string;
}

const ReviewQueue = () => {
  const [pendingBatches, setPendingBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchPendingBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://backend-fake-review-detection.onrender.com/batch?status=Pending"
      );
      if (!response.ok) throw new Error("Failed to fetch pending batches");
      const data = await response.json();
      setPendingBatches(data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading pending batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBatches();
  }, []);

  const handleRemoveBatch = async (id: string, filename: string) => {
    try {
      setRemoving(id);
      const res = await fetch(
        `https://backend-fake-review-detection.onrender.com/batch/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove batch");

      setPendingBatches((prev) => prev.filter((batch) => batch._id !== id));
      toast.success(`Removed ${filename} from queue`);
    } catch (error) {
      console.error(error);
      toast.error("Error removing batch");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analysis Queue</h1>
            <p className="text-muted-foreground mt-1">
              Batch files pending AI analysis
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchPendingBatches}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Batches ({pendingBatches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-6">
                Loading pending batches...
              </p>
            ) : pendingBatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No pending batches found
              </p>
            ) : (
              <div className="space-y-4">
                {pendingBatches.map((batch) => {
                  const isZip = batch.batch_name.endsWith(".zip");
                  const formattedDate = new Date(
                    batch.uploaded_at
                  ).toLocaleString();

                  return (
                    <div
                      key={batch._id}
                      className="p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {isZip ? (
                            <FileArchive className="h-5 w-5 text-primary mt-0.5" />
                          ) : (
                            <FileCode className="h-5 w-5 text-primary mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <h3 className="font-semibold">{batch.batch_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {batch.total_reviews} reviews • Uploaded {formattedDate}
                            </p>
                          </div>
                        </div>
                        <Badge status="pending" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 animate-pulse" />
                          <span>Processing... This may take a few minutes</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={removing === batch._id}
                          onClick={() =>
                            handleRemoveBatch(batch._id, batch.batch_name)
                          }
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          {removing === batch._id ? "Removing..." : "Remove"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewQueue;
