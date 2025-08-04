import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// TODO: Define the actual structure of DashboardData in next steps
type DashboardData = any;

const Home: React.FC = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDashboardData = async (): Promise<void> => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DASHBOARD_DATA}?t=${Date.now()}`
      );

      if (response.data) {
        setDashboardData(response.data);
      } else {
        console.log("No data received from dashboard endpoint");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      console.error("Error fetching dashboard data:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="dashboard">
      <div className="my-5 mx-auto">Home</div>
    </DashboardLayout>
  );
};

export default Home;
