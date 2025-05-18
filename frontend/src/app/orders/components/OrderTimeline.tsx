import { CheckCircle, Clock, Package } from "lucide-react";

interface OrderTimelineProps {
  status: string;
}

const OrderTimeline = ({ status }: OrderTimelineProps) => {
  const getTimelineStatus = (orderStatus: string, currentStep: string) => {
    const steps = ["pending", "processing", "delivered"];
    const currentIndex = steps.indexOf(orderStatus);
    const stepIndex = steps.indexOf(currentStep);

    if (stepIndex < currentIndex) {
      return "completed";
    } else if (stepIndex === currentIndex) {
      return "current";
    } else {
      return "upcoming";
    }
  };

  const getTimelineIcon = (status: string, step: string) => {
    const timelineStatus = getTimelineStatus(status, step);

    if (timelineStatus === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (timelineStatus === "current") {
      return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    } else {
      return <Package className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
      <div className="relative flex justify-between">
        {[
          { step: "pending", label: "Chờ xử lý" },
          { step: "processing", label: "Đang giao" },
          { step: "delivered", label: "Đã giao" },
        ].map(({ step, label }) => {
          const timelineStatus = getTimelineStatus(status, step);
          const isCompleted = timelineStatus === "completed";
          const isCurrent = timelineStatus === "current";

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  isCompleted
                    ? "bg-green-50"
                    : isCurrent
                    ? "bg-blue-50"
                    : "bg-gray-50"
                }`}
              >
                {getTimelineIcon(status, step)}
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-blue-500 mt-1">Đang xử lý</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
