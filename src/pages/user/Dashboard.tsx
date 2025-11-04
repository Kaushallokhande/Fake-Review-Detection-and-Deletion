import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/Badge";
import { Input } from "@/components/ui/input";
import { FileText, Clock, CheckCircle2, AlertCircle, Search, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stats = {
    totalBatches: batches.length,
    pendingBatches: batches.filter((b) => b.status.toLowerCase() !== "completed").length,
    totalReviewsAnalyzed: batches.reduce((sum, b) => sum + b.total_reviews, 0),
    averageGenuineRate:
      batches.length > 0
        ? Math.round(
            batches.reduce((sum, b) => sum + (b.genuine_percentage || 0), 0) / batches.length
          )
        : 0,
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://backend-fake-review-detection.onrender.com/batch");
        if (!response.ok) throw new Error("Failed to fetch batch data");
        const data = await response.json();
        setBatches(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const filteredBatches = batches.filter(
    (batch) =>
      batch.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.uploaded_at.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your batch analysis overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Batches"
            value={stats.totalBatches}
            icon={FileText}
            trend={{ value: stats.totalBatches, isPositive: true }}
          />
          <StatCard title="Pending Analysis" value={stats.pendingBatches} icon={Clock} />
          <StatCard
            title="Reviews Analyzed"
            value={stats.totalReviewsAnalyzed}
            icon={CheckCircle2}
            trend={{ value: stats.totalReviewsAnalyzed, isPositive: true }}
          />
          <StatCard
            title="Avg Genuine Rate"
            value={`${stats.averageGenuineRate}%`}
            icon={AlertCircle}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Batch Analyses</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading batches...</p>
            ) : error ? (
              <p className="text-center text-destructive py-8">{error}</p>
            ) : filteredBatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No batches found</p>
            ) : (
              <div className="space-y-3">
                {filteredBatches.map((batch) => (
                  <div
                    key={batch._id}
                    onClick={() =>
                      batch.status.toLowerCase() === "completed" &&
                      navigate(`/dashboard/batch/${batch._id}`)
                    }
                    className={`p-4 border rounded-lg transition-all space-y-3 ${
                      batch.status.toLowerCase() === "completed"
                        ? "hover:bg-accent hover:border-primary cursor-pointer"
                        : "opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{batch.batch_name}</p>
                          {batch.status.toLowerCase() === "completed" && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {batch.total_reviews} reviews •{" "}
                          {new Date(batch.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        status={
                          batch.status.toLowerCase() === "completed"
                            ? "genuine"
                            : "pending"
                        }
                      />
                    </div>

                    {batch.status.toLowerCase() === "completed" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-success">
                            Authentic: {batch.genuine_percentage}%
                          </span>
                          <span className="text-destructive">
                            Suspicious: {batch.suspicious_percentage}%
                          </span>
                        </div>
                        <Progress value={batch.genuine_percentage} className="h-2" />
                      </div>
                    )}
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

export default Dashboard;
