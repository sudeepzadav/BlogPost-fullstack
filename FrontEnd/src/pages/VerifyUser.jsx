import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const VerifyUser = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/verify-email/${verificationToken}`,
        );
        toast.success(res.data.message);
        navigate("/signin");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    verifyUser();
    // eslint-disable-next-line
  }, [verificationToken]);
  return <div>VerifyUser</div>;
};

export default VerifyUser;