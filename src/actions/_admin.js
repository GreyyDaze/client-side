import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

export const useGetAttendanceSummary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/attendance/summary`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        setData(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return { data, loading };
};

export const useGetAdminProfile = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    // console.log("fetchData created");
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/profile/${user?._id}`);
      setData(data);
      // console.log(data, "get profile");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("useEffect executed");
    if (token) fetchData();
  }, [token]);

  return { data, loading };
};

export const useGetAllLeaves = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/leaves`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        setData(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return { data, loading };
};

export const useApproveLeave = () => {
  const [loading, setLoading] = useState(false);

  const approveLeave = async (leaveId, status) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/admin/approve-leave`, {
        leaveId,
        status,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Leave approved successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { approveLeave, loading };
};

export const useGetAllAttendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/attendance`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        setData(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return { data, loading };
};

export const useGetSingleAttendance = () => {
  const [loading, setLoading] = useState(false);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/attendance/${id}`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading };
};

export const useUpdateAttendance = () => {
  const [loading, setLoading] = useState(false);

  const updateAttendance = async (id, status, date) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/attendance/${id}`, {
        date,
        status,
      });
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Attendance updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { updateAttendance, loading };
};

export const useDeleteAttendance = () => {
  const [loading, setLoading] = useState(false);

  const deleteAttendance = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/attendance/${id}`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Attendance deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteAttendance, loading };
};

export const useGetAllUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/users`);
      console.log(data, "data");
      if (data.error) {
        toast.error(data.error);
      } else {
        setData(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return { data, loading };
};

export const useSystemReport = () => {
  const [loading, setLoading] = useState(false);

  const generateReport = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.get("system-report", {
        params: { startDate, endDate },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating system report:", error);
    } finally {
      setLoading(false);
    }
  };

  return { generateReport, loading };
};

export const useUserReport = () => {
  const [loading, setLoading] = useState(false);

  const generateUserReport = async (userIds, startDate, endDate) => {
    console.log(userIds, startDate, endDate, "userIds, startDate, endDate");
    setLoading(true);
    try {
      const response = await axios.get("/users-report", {
        params: { userIds, startDate, endDate },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating user report:", error);
    } finally {
      setLoading(false);
    }
  };

  return { generateUserReport, loading };
};

export const useCreateAttendance = () => {
  const [loading, setLoading] = useState(false);

  const createAttendance = async (userId, status, date) => {
    setLoading(true);
    try {
      const { data } = await axios.post("attendance", { userId, status, date });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Attendance created  successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { createAttendance, loading };
};
