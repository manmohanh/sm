import axios from "axios";
import { toast } from "react-toastify";

const CatchError = (error: unknown) => {
  if (axios.isAxiosError(error))
    return toast.error(error.response?.data.message);

  if (error instanceof Error) return toast.error(error.message);

  return toast.error("Network Error");
};

export default CatchError;
