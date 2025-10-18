import type { FC } from "react";

interface ErrorInterface {
  message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 bg-red-50 border border-red-200 rounded-2xl shadow-sm max-w-md mx-auto mt-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
        <i className="ri-error-warning-fill text-red-500 text-2xl"></i>
      </div>
      <h2 className="text-lg font-semibold text-red-600 mb-1">Something went wrong</h2>
      <p className="text-sm text-red-500">{message}</p>
    </div>
  );
};

export default Error;
