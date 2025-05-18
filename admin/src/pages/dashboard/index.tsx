import { useState } from "react";
import { Card, Tabs } from "antd";
import {
  useGetRevenueOfDateByRangeQuery as useGetDailyRevenueQuery,
  useGetRevenueByMonthQuery as useGetMonthlyRevenueQuery,
  useGetRevenueByYearQuery as useGetYearlyRevenueQuery,
} from "../../redux/features/revenue/revenueApi";
import dayjs from "dayjs";
import { DailyChart } from "./components/DailyChart";
import { MonthlyChart } from "./components/MonthlyChart";
import { YearlyChart } from "./components/YearlyChart";
import { SummaryStats } from "./components/SummaryStats";

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    [dayjs().subtract(7, "day"), dayjs()]
  );
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);

  const { data: dailyData, isLoading: isDailyLoading } =
    useGetDailyRevenueQuery(
      {
        startDate: dateRange?.[0].format("YYYY-MM-DD") || "",
        endDate: dateRange?.[1].format("YYYY-MM-DD") || "",
      },
      {
        skip: !dateRange,
      }
    );

  const { data: monthlyData, isLoading: isMonthlyLoading } =
    useGetMonthlyRevenueQuery(
      {
        year: selectedYear,
        month: selectedMonth,
      },
      {
        skip: !selectedYear,
      }
    );

  const { data: yearlyData, isLoading: isYearlyLoading } =
    useGetYearlyRevenueQuery({
      year: selectedYear,
    });

  const items = [
    {
      key: "daily",
      label: "Daily",
      children: (
        <DailyChart
          data={dailyData}
          isLoading={isDailyLoading}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      ),
    },
    {
      key: "monthly",
      label: "Monthly",
      children: (
        <MonthlyChart
          data={monthlyData}
          isLoading={isMonthlyLoading}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      ),
    },
    {
      key: "yearly",
      label: "Yearly",
      children: <YearlyChart data={yearlyData} isLoading={isYearlyLoading} />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <SummaryStats data={dailyData} />
      <Card>
        <Tabs defaultActiveKey="daily" items={items} />
      </Card>
    </div>
  );
};

export default DashboardPage;
