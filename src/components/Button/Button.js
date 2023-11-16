import "./button.css";

const Button = ({ children, ...props }) => {
  const positionStyle =
    props.position === "left" ? { left: "20px" } : { right: "20px" };

  return (
    <button {...props} className="button" style={{ ...positionStyle }}>
      {children}
    </button>
  );
};

export default Button;
