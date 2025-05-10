import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { ShippingMethodSectionProps, ShippingMethod } from "@/types/checkout";

const ShippingMethodSection = ({
  isLoadingMethods,
  shippingMethods,
  selectedShippingMethod,
  handleShippingMethodChange,
}: ShippingMethodSectionProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-md">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-xl flex items-center gap-3 font-semibold text-gray-800">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow">
            2
          </span>
          Phương Thức Vận Chuyển
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoadingMethods ? (
          <div className="flex items-center justify-center py-8">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <RadioGroup
            value={selectedShippingMethod}
            onValueChange={handleShippingMethodChange}
            className="space-y-4"
          >
            {shippingMethods?.data?.map((method: ShippingMethod) => (
              <div
                key={method._id}
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-colors cursor-pointer bg-gray-50 hover:bg-primary/10 hover:border-primary ${
                  selectedShippingMethod === method._id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem value={method._id} id={method._id} />
                <Label
                  htmlFor={method._id}
                  className="flex flex-1 justify-between items-center cursor-pointer text-base font-medium text-gray-700"
                >
                  <span>{method.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingMethodSection;
