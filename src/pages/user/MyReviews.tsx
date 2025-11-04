import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileArchive, FileCode, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const MyReviews = () => {
  const navigate = useNavigate();
  
  const batches = [
    {
      id: 1,
      filename: "reviews_batch_01.zip",
      totalReviews: 150,
      uploadDate: "2024-01-15",
      status: "genuine" as const,
      genuinePercent: 78,
      fakePercent: 22,
      fileType: "zip",
    },
    {
      id: 2,
      filename: "product_reviews.xml",
      totalReviews: 95,
      uploadDate: "2024-01-14",
      status: "pending" as const,
      genuinePercent: 0,
      fakePercent: 0,
      fileType: "xml",
    },
    {
      id: 3,
      filename: "reviews_batch_02.zip",
      totalReviews: 200,
      uploadDate: "2024-01-13",
      status: "genuine" as const,
      genuinePercent: 65,
      fakePercent: 35,
      fileType: "zip",
    },
    {
      id: 4,
      filename: "customer_feedback.xml",
      totalReviews: 120,
      uploadDate: "2024-01-12",
      status: "genuine" as const,
      genuinePercent: 82,
      fakePercent: 18,
      fileType: "xml",
    },
  ];

  const handleDownload = (filename: string) => {
    toast.success(`Downloading ${filename} results...`);
  };

  const handleDelete = (id: number) => {
    toast.success("Batch analysis deleted successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Batch Analyses</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your submitted batch analyses
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Batches ({batches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => batch.status !== "pending" && navigate(`/dashboard/batch/${batch.id}`)}
                  className={`p-4 border rounded-lg space-y-3 transition-colors ${
                    batch.status !== "pending"
                      ? "hover:bg-accent hover:border-primary cursor-pointer"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {batch.fileType === "zip" ? (
                        <FileArchive className="h-5 w-5 text-primary mt-0.5" />
                      ) : (
                        <FileCode className="h-5 w-5 text-primary mt-0.5" />
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{batch.filename}</h3>
                          {batch.status !== "pending" && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {batch.totalReviews} reviews • {batch.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Badge status={batch.status} />
                  </div>
                  
                  {batch.status !== "pending" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-success">Genuine: {batch.genuinePercent}%</span>
                        <span className="text-destructive">Fake: {batch.fakePercent}%</span>
                      </div>
                      <Progress value={batch.genuinePercent} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {Math.round(batch.totalReviews * batch.genuinePercent / 100)} genuine • {Math.round(batch.totalReviews * batch.fakePercent / 100)} fake
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {batch.status !== "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(batch.filename)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download Results
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(batch.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
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

export default MyReviews;
