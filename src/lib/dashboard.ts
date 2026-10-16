import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export type DashboardRange = "current_month" | "last_3_months" | "last_6_months";

export interface DashboardBalanceBucket {
    amount: number;
    count: number;
}

export interface DashboardBalance {
    total: number;
    current: DashboardBalanceBucket;
    overdue: DashboardBalanceBucket;
}

export interface DashboardSalesTotal {
    series: { date: string; total: number }[];
    total: number;
    change_percent: number;
}

export interface DashboardTransactionsFlow {
    series: { date: string; income: number; expense: number }[];
    total_income: number;
    total_expense: number;
    income_change_percent: number;
    expense_change_percent: number;
}

export interface DashboardExpenseDistributionItem {
    account_id: number;
    name: string;
    amount: number;
    percent: number;
}

export interface DashboardTopProduct {
    item_id: number;
    name: string;
    quantity: number;
    total: number;
}

export interface DashboardTopCustomer {
    contact_id: number;
    name: string;
    document_count: number;
    total: number;
}

export interface DashboardSummary {
    range: DashboardRange;
    period: { from: string; to: string };
    accounts_receivable: DashboardBalance;
    accounts_payable: DashboardBalance;
    taxes_on_sales: number;
    products_sold: number;
    customer_returns: number;
    customers_with_sales: number;
    sales_total: DashboardSalesTotal;
    transactions_flow: DashboardTransactionsFlow;
    expense_distribution: DashboardExpenseDistributionItem[];
    top_products: DashboardTopProduct[];
    top_customers: DashboardTopCustomer[];
}

export const dashboardApi = {
    getSummary: async (range: DashboardRange): Promise<ApiResponse<DashboardSummary>> => {
        return await apiClient.get<DashboardSummary>("/dashboard", { params: { range } });
    },
};
