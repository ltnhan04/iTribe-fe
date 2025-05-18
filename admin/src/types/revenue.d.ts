export interface IResponseRevenue {
  status: string;
  data: Data;
}

export interface Data {
  report: Report[];
  summary: Summary;
}

export interface Report {
  date: string;
  label: string;
  totalSales: number;
  totalOrders: number;
}

export interface Summary {
  totalSales: string;
  totalOrders: number;
  averageOrderValue: string;
}
