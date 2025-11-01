import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import Button from "./shared/Button";
import CatchError from "../lib/CatchError";
import HttpInterceptor, { env } from "../lib/HttpInterceptor";

const Home = () => {
  const { error, isLoading, Razorpay } = useRazorpay();

  const pay = async () => {
    try {
      const { data } = await HttpInterceptor.post("/payment/order", {
        amount: 500,
      });

      const options: RazorpayOrderOptions = {
        key: env.VITE_RAZORPAY_KEY_ID,
        name: "MovieColl",
        amount: data.amout,
        currency: data.currency,
        order_id: data.id,
        handler:(data)=>{

        }
      };
      const rzp = new Razorpay(options);
      rzp.open()

      rzp.on("payment.failed",(data)=>{
        console.log(data)
      })
    } catch (error) {
      CatchError(error);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={pay}>Pay now</Button>
    </div>
  );
};

export default Home;
