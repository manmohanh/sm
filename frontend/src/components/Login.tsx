import { Link } from "react-router-dom";
import Button from "./shared/Button";
import Card from "./shared/Card";
import Input from "./shared/Input";

const Login = () => {
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-6/12 animate__animated animate__fadeIn">
        <Card noPadding>
          <div className="grid grid-cols-2">
            <div className="p-8 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-black">SIGN IN</h1>
                <p className="text-gray-500">Start your first chat now!</p>
              </div>
              <form className=" space-y-6">
                
                <Input name="email" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
            
                <Button icon="arrow-right-up-line" type="secondary">
                  Sign in
                </Button>
              </form>
              <div className="flex gap-2">
                <p>Don't have an account ?</p>
                <Link
                  to="/signup"
                  className="text-blue-500 font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="overflow-hidden h-[500px] bg-linear-to-t from-sky-500 to-indigo-500 rounded-r-lg flex justify-center items-center">
              <img
                src="/images/signin.svg"
                alt="auth"
                className="w-[70%] animate__animated animate__slideInUp animate__faster"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
