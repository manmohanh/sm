import { Link,useNavigate } from "react-router-dom";
import Button from "./shared/Button";
import Card from "./shared/Card";
import Input from "./shared/Input";
import Form, { type FormDataType } from "./shared/Form";
import HttpInterceptor from "../lib/HttpInterceptor";
import CatchError from "../lib/CatchError";

const Signup = () => {
  const navigate = useNavigate()
  const handleSubmit = async (values: FormDataType) => {
    try {
      await HttpInterceptor.post("/auth/signup", values);
      navigate("/login")
    } catch (error) {
      CatchError(error)
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-6/12 animate__animated animate__fadeIn">
        <Card noPadding>
          <div className="grid grid-cols-2">
            <div className="p-8 space-y-6">
              
              <div>
                <h1 className="text-xl font-bold text-black">SIGN UP</h1>
                <p className="text-gray-500">Start your first chat now!</p>
              </div>
              <Form className=" space-y-6" onValue={handleSubmit}>
                <Input name="fullname" placeholder="Fullname" />
                <Input name="email" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
                <Input name="mobile" placeholder="Mobile" />

                <Button icon="arrow-right-up-line" type="secondary">
                  Sign up
                </Button>
              </Form>
              <div className="flex gap-2">
                <p>Already have an account ?</p>
                <Link
                  to="/login"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="overflow-hidden h-[500px] bg-linear-to-t from-sky-500 to-indigo-500 rounded-r-lg flex justify-center items-center">
              <img
                src="/images/signup.svg"
                alt="auth"
                className="w-full animate__animated animate__slideInUp animate__faster"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
