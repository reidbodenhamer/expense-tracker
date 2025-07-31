export const API_BASE_URL = "http://localhost:8000";
export const ROUTE_PREFIX = "/expense-tracker";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: "/api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        DOWNLOAD_INCOME_EXCEL: "/api/v1/income/download-excel",
        DELETE_INCOME: (incomeId: string) => `/api/v1/income/${incomeId}`,
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DOWNLOAD_EXPENSE_EXCEL: "/api/v1/expense/download-excel",
        DELETE_EXPENSE: (expenseId: string) => `/api/v1/expense/${expenseId}`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image"
    }
};