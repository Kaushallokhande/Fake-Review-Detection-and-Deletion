import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileArchive, FileCode, ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const API_BASE = "https://backend-fake-review-detection.onrender.com";

const MyReviews = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/batch`);
      if (!res.ok) throw new Error("Failed to fetch batches");
      const data = await res.json();

      if (!Array.isArray(data)) throw new Error("Invalid API response");
      setBatches(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching batch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (batchId: string, filename: string) => {
    toast.info("Preparing download...");
    try {
      const res = await fetch(`${API_BASE}/batch/${batchId}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename.replace(/\.[^/.]+$/, "")}_results.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Batch results downloaded successfully");
    } catch {
      toast.error("Failed to download batch data");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/batch/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Batch deleted successfully");
      setBatches((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Failed to delete batch");
    }
  };

  // Filtering logic
  const filteredBatches = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return batches;
    return batches.filter((batch) => {
      const uploadedDate = new Date(batch.uploaded_at).toLocaleDateString();
      return (
        batch.batch_name.toLowerCase().includes(query) ||
        batch.status.toLowerCase().includes(query) ||
        uploadedDate.includes(query)
      );
    });
  }, [batches, searchTerm]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Batch Analyses</h1>
            <p className="text-muted-foreground mt-1">
              View, search, and manage your submitted batch analyses
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, status, or date..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {loading ? "Loading batches..." : `All Batches (${filteredBatches.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Fetching batch data...</p>
            ) : filteredBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No batches found for your search.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredBatches.map((batch) => (
                  <div
                    key={batch._id}
                    onClick={() =>
                      batch.status === "Completed" &&
                      navigate(`/dashboard/batch/${batch._id}`)
                    }
                    className={`p-4 border rounded-lg space-y-3 transition-colors ${
                      batch.status === "Completed"
                        ? "hover:bg-accent hover:border-primary cursor-pointer"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {batch.batch_name.endsWith(".zip") ? (
                          <FileArchive className="h-5 w-5 text-primary mt-0.5" />
                        ) : (
                          <FileCode className="h-5 w-5 text-primary mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{batch.batch_name}</h3>
                            {batch.status === "Completed" && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {batch.total_reviews} reviews •{" "}
                            {new Date(batch.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        status={
                          batch.status === "Completed" ? "genuine" : "pending"
                        }
                      />
                    </div>

                    {batch.status === "Completed" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-success">
                            Genuine: {batch.genuine_percentage}%
                          </span>
                          <span className="text-destructive">
                            Suspicious: {batch.suspicious_percentage}%
                          </span>
                        </div>
                        <Progress value={batch.genuine_percentage} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {Math.round(
                            batch.total_reviews * (batch.genuine_percentage / 100)
                          )}{" "}
                          genuine •{" "}
                          {Math.round(
                            batch.total_reviews * (batch.suspicious_percentage / 100)
                          )}{" "}
                          suspicious
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {batch.status === "Completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(batch._id, batch.batch_name)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Results
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(batch._id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyReviews;
