import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Trash2, Search, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";


interface Review {
  _id: string;
  username: string;
  rating: number;
  feedback: string;
  sentiment: { label: string; score: number };
  ai_detection: { ai_probability: number; label: string };
  spam_detection: { label: string; score: number };
  link_detection: { has_link: boolean };
  promotional_keywords: { is_promotional: boolean };
  rating_sentiment_consistency: string;
  authenticity: { score: number; status: string };
}

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [batch, setBatch] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  // Fetch batch details and reviews from backend
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const res = await fetch(`https://backend-fake-review-detection.onrender.com/batch/${id}`);
        const data = await res.json();
        setBatch(data.batch);
        setReviews(data.reviews);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load batch data");
      }
    };
    fetchBatchData();
  }, [id]);

  const filteredReviews = reviews.filter(
    (review) =>
      review.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleReviewSelection = (id: string) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  // ✅ Helper to trigger JSON file download
  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ✅ Download raw file with separated genuine & suspicious reviews
  const handleDownloadAll = () => {
    if (!reviews.length) return toast.error("No reviews found");

    const genuine = reviews.filter((r) => r.authenticity.status.includes("authentic"));
    const suspicious = reviews.filter((r) => !r.authenticity.status.includes("authentic"));

    const result = {
      batch: batch?.batch_name || "Batch",
      summary: {
        total_reviews: reviews.length,
        genuine_count: genuine.length,
        suspicious_count: suspicious.length,
      },
      genuine_reviews: genuine,
      suspicious_reviews: suspicious,
    };

    downloadJSON(result, `${batch?.batch_name || "batch"}_raw_separated.json`);
    toast.success("Raw file (with genuine + suspicious) downloaded");
  };

  // ✅ Download genuine reviews only
  const handleDownloadAuthentic = () => {
    const genuine = reviews.filter((r) => r.authenticity.status.includes("authentic"));
    if (!genuine.length) return toast.error("No genuine reviews found");
    downloadJSON(genuine, `${batch?.batch_name || "batch"}_authentic.json`);
    toast.success(`${genuine.length} genuine reviews downloaded`);
  };

  // ✅ Download selected reviews
  const handleDownloadSelected = () => {
    if (selectedReviews.length === 0) return toast.error("No reviews selected");
    const selected = reviews.filter((r) => selectedReviews.includes(r._id));
    downloadJSON(selected, `selected_reviews.json`);
    toast.success(`${selected.length} selected reviews downloaded`);
  };

  // ✅ Delete selected reviews
  const handleDeleteSelected = () => {
    if (selectedReviews.length === 0) return toast.error("No reviews selected");
    const remaining = reviews.filter((r) => !selectedReviews.includes(r._id));
    setReviews(remaining);
    setSelectedReviews([]);
    toast.success(`${reviews.length - remaining.length} reviews deleted`);
  };

  if (!batch) return <div className="p-6">Loading...</div>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{batch.batch_name}</h1>
              <p className="text-muted-foreground">
                Uploaded on {new Date(batch.uploaded_at).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownloadAll} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Raw File
            </Button>
            <Button onClick={handleDownloadAuthentic}>
              <Download className="h-4 w-4 mr-2" />
              Download Authentic Only
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{batch.total_reviews}</div>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">{batch.genuine_percentage}%</div>
              <p className="text-xs text-muted-foreground">Genuine Reviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-destructive">{batch.suspicious_percentage}%</div>
              <p className="text-xs text-muted-foreground">Suspicious Reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Review Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Review Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                {selectedReviews.length > 0 && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleDownloadSelected}>
                      <Download className="h-4 w-4 mr-2" />
                      Download ({selectedReviews.length})
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedReviews.length})
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Select</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>AI%</TableHead>
                    <TableHead>Spam%</TableHead>
                    <TableHead>Links</TableHead>
                    <TableHead>Promo</TableHead>
                    <TableHead>Consistency</TableHead>
                    <TableHead>Auth%</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review._id)}
                          onChange={() => toggleReviewSelection(review._id)}
                        />
                      </TableCell>
                      <TableCell>{review.username}</TableCell>
                      <TableCell className="max-w-xs truncate">{review.feedback}</TableCell>
                      <TableCell>{review.rating}/5</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            review.sentiment.label === "POSITIVE"
                              ? "bg-green-600 text-white"
                              : review.sentiment.label === "NEGATIVE"
                                ? "bg-red-600 text-white"
                                : "bg-gray-500 text-white"   // Unknown → Neutral Gray
                          }
                        >
                          {review.sentiment.label === "POSITIVE"
                            ? "Positive"
                            : review.sentiment.label === "NEGATIVE"
                              ? "Negative"
                              : "Neutral"
                          }
                        </Badge>
                      </TableCell>


                      <TableCell>{(review.ai_detection.ai_probability * 100).toFixed(0)}%</TableCell>
                      <TableCell>{review.spam_detection.score}%</TableCell>
                      <TableCell>{review.link_detection.has_link ? "Yes" : "-"}</TableCell>
                      <TableCell>{review.promotional_keywords.is_promotional ? "Yes" : "-"}</TableCell>
                      <TableCell>
                        {review.rating_sentiment_consistency === "consistent" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Progress
            value={review.authenticity.score * 100}
            className="w-16 h-2 cursor-pointer"
          />
        </div>
      </TooltipTrigger>

      <TooltipContent side="top" align="center">
        <p>{(review.authenticity.score * 100).toFixed(1)}%</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</TableCell>


                      <TableCell>
                        <Badge
                          className={
                            review.authenticity.status === "highly_authentic"
                              ? "bg-green-600 text-white"
                              : review.authenticity.status === "moderately_authentic"
                                ? "bg-yellow-500 text-black"
                                : "bg-red-600 text-white"
                          }
                        >
                          {review.authenticity.status === "highly_authentic"
                            ? "High"
                            : review.authenticity.status === "moderately_authentic"
                              ? "Moderate"
                              : "Suspicious"}
                        </Badge>
                      </TableCell>



                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BatchDetail;
