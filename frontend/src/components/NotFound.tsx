import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-6">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-600 mt-4">
        Oops! Page not found
      </p>
      <p className="text-gray-500 mt-2">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-md hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
