
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, Loader2 } from "lucide-react";

interface PointsCardProps {
  points: number | undefined;
  isLoading: boolean;
}

export function PointsCard({ points, isLoading }: PointsCardProps) {
  return (
    <Card className="p-6 mb-8 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-medium text-gray-900">Điểm của bạn</h2>
        </div>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-black" />
        ) : (
          <span className="text-2xl font-bold text-black">{points || 0}</span>
        )}
      </div>
      <Progress
        value={((points || 0) / 1000) * 100}
        className="h-2 bg-gray-100"
      />
      <p className="text-sm text-gray-600 mt-2">
        Điểm cần để đổi voucher tiếp theo:{" "}
        <span className="font-medium text-black">{1000 - (points || 0)}</span>
      </p>
    </Card>
  );
} 