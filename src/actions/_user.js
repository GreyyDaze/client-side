import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import toast from "react-hot-toast";

export const useGetProfile = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    // console.log("fetchData created");
    setLoading(true);
    try {
      const { data } = await axios.get(`/user/profile/${user?._id}`);
      setData(data);
      console.log(data, "get profile");
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

export const useMarkAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const postAttendance = async (userId) => {
    // console.log("payload", userId);
    setLoading(true);
    try {
      const { data } = await axios.post(`/user/attendance`, { userId });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        window.location.reload();
        setIsDisabled(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { postAttendance, loading, isDisabled, setIsDisabled };
};

export const useGetTodayAttendance = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    const payload = {
      userId: user?._id,
      limit: 1,
    };

    console.log("payload1", payload);
    setLoading(true);
    try {
      const response = await axios.get("/user/attendance/", {
        params: payload,
      });

      console.log(response, "response1");

      if (response.status === 200) {
        setStatus(response.data[0]?.status);
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

  return { status, loading };
};

export const useGetLastWeekAttendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    const payload = {
      userId: user?._id,
      limit: 7,
    };

    console.log("payload", payload);
    setLoading(true);
    try {
      const response = await axios.get("/user/attendance/", {
        params: payload,
      });

      console.log(response, "response");
      if (response.status === 200) {
        console.log("hello i am here");
        setData(response.data);
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
export const useGetPreviousAttendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    const payload = {
      userId: user?._id,
    };

    // console.log("payload", payload);
    setLoading(true);
    try {
      const response = await axios.get("/user/attendance/", {
        params: payload,
      });

      console.log(response, "response");
      if (response.status === 200) {
        // console.log("hello i am here");
        setData(response.data);
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

export const useApplyLeave = () => {
  const [loading, setLoading] = useState(false);

  const postLeave = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/user/apply-leave`, values);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { postLeave, loading };
};

export const useGetLeaves = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/user/leaves/${user?._id}`);
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

export const useGetSingleLeave = () => {
  const [loading, setLoading] = useState(false);

  const fetchData = async (leaveId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/user/leave/${leaveId}`);
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

export const useUpdateLeave = () => {
  const [loading, setLoading] = useState(false);

  const updateLeave = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/user/leave/update`, values);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { updateLeave, loading };
};

export const useDeleteLeave = () => {
  const [loading, setLoading] = useState(false);

  const deleteLeave = async (leaveId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`leave/`, {
        params: { leaveId },
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { deleteLeave, loading };
};

export const useGetNumbers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/user/statistics`, {
        params: { userId: user?._id },
      });
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
