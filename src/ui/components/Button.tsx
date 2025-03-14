interface ButtonProps {
    text: string;
    size: "sm" | "md" | "lg";
    reference?: React.Ref<HTMLButtonElement>;
    onClick?: () => void;
    color?: "red" | "black" | "blue";
    type? : "submit"
}
const Button = ({text, size, reference, onClick, color, type}: ButtonProps) => {

    const sizeValues = {
        "sm": `px-4 py-2 rounded border-2 border-black-500`,
        "md": `px-6 py-2 rounded-2xl border-1 border-black-500`,
        "lg": `px-8 py-8 rounded-3xl border-2 border-black-500`,
    }

    const colorValues = {
      "red": "bg-red-500",
      "blue": "bg-blue-500",
      "black": "bg-neutral-800 border-neutral-800",
      "none": "bg-none",
    }

  return (
    <button ref={reference} type={type} onClick={onClick} className={`${sizeValues[size]} hover:cursor-pointer ${colorValues[color ?? "none"]}`}>{text}</button>
  )
}

export default Button