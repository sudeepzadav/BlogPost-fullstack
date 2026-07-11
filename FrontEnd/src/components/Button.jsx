import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Button = ({
  children,
  loading,
  className,
  onClick,
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full min-w-18 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      {...rest}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin text-xl" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;