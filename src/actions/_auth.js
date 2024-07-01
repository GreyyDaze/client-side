import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { paths } from "../utils/paths";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    try {
      const { data } = await axios.post("/user/register", values);
      if (data.error) {
        toast.error(data.error);
      } else {
        navigate(paths.login);
        toast.success("Signup Successfully. Please login.");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { onFinish, loading };
};

export const useAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/user/login", values);
      if (data.error) {
        toast.error(data.error);
      } else {
        login(data.token, data.user);
        navigate(paths.userDashboard);
        toast.success("Login successful!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { onFinish, loading };
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post("/admin/login", values);
      if (data.error) {
        toast.error(data.error);
      } else {
        navigate(paths.adminDashboard);
        login(data.token, data.user);
        toast.success("Login successful!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { onFinish, loading };
};
