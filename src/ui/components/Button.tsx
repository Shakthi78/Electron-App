interface ButtonProps {
    text?: string;
    size: "sm" | "md" | "lg";
    reference?: React.Ref<HTMLButtonElement>;
    onClick?: () => void;
    color?: "red" | "black" | "blue";
    type? : "submit";
    icon?: any
}

const Button = ({text, size, reference, onClick, color, type, icon}: ButtonProps) => {

  const sizeValues = {
    "sm": `px-4 py-2 rounded border-2 border-black-500`,
    "md": `px-6 py-2 rounded-2xl border-1 border-black-500`,
    "lg": `px-8 py-6 rounded-3xl border-2 border-black-500`,
  }

  const colorValues = {
    "red": "bg-red-600 hover:bg-red-500 border-none",
    "blue": "bg-blue-600 hover:bg-blue-500",
    "black": "bg-neutral-800 border-none hover:bg-neutral-700",
    "none": "bg-none",
  }

  return (   
    <button ref={reference} type={type} onClick={onClick} className={`${sizeValues[size]} hover:cursor-pointer ${colorValues[color ?? "none"]} flex flex-col justify-center items-center gap-3 select-none`}>{icon} <h2 className="text-sm">{text}</h2></button>
  )
}

export default Button