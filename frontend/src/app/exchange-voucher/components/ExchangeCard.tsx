"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Loader2 } from "lucide-react";
import { useState } from "react";

const POINT_SUGGESTIONS = [
  { points: 100, value: "100.000 VND" },
  { points: 300, value: "300.000 VND" },
  { points: 500, value: "500.000 VND" },
];

interface ExchangeCardProps {
  pointToUse: string;
  setPointToUse: (value: string) => void;
  onExchange: () => void;
  isExchanging: boolean;
  maxPoints: number;
}

export function ExchangeCard({
  pointToUse,
  setPointToUse,
  onExchange,
  isExchanging,
  maxPoints,
}: ExchangeCardProps) {
  const [error, setError] = useState<string>("");

  const handlePointChange = (value: string) => {
    setError("");
    const points = parseInt(value);
    
    if (isNaN(points)) {
      setError("Vui lòng nhập số điểm hợp lệ");
    } else if (points <= 0) {
      setError("Số điểm phải lớn hơn 0");
    } else if (points > maxPoints) {
      setError(`Bạn chỉ có ${maxPoints} điểm`);
    }
    
    setPointToUse(value);
  };

  return (
    <Card className="p-6 mb-8 bg-white shadow-sm border-gray-200">
      <h2 className="text-xl font-medium mb-4 text-gray-900">
        Đổi điểm lấy voucher
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Nhập số điểm muốn đổi"
              value={pointToUse}
              onChange={(e) => handlePointChange(e.target.value)}
              className={`flex-1 border-gray-200 focus:border-black ${
                error ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            <Button
              onClick={onExchange}
              disabled={isExchanging || !!error}
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
            >
              {isExchanging ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Gift className="w-4 h-4 mr-2" />
              )}
              Đổi ngay
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        <div className="flex gap-2">
          {POINT_SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion.points}
              variant="outline"
              onClick={() => handlePointChange(suggestion.points.toString())}
              className={`flex-1 border-gray-200 hover:border-black hover:bg-gray-50 ${
                suggestion.points > maxPoints ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={suggestion.points > maxPoints}
            >
              <span className="font-medium text-black">
                {suggestion.points}đ
              </span>
              <span className="text-sm text-gray-500 ml-1">
                ({suggestion.value})
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
} 