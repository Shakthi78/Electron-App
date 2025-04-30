interface ButtonProps {
    text?: string;
    size: "sm" | "md" | "lg";
    reference?: React.Ref<HTMLButtonElement>;
    onClick?: () => void;
    color?: "red" | "black" | "blue" | "light-black";
    type? : "submit";
    icon?: any;
    id?: string
}

const Button = ({text, size, reference, onClick, color, type, icon, id}: ButtonProps) => {

  const sizeValues = {
    "sm": `px-6 py-2 rounded`,
    "md": `px-6 py-2 rounded-lg`,
    "lg": `px-8 py-4 rounded-xl`,
  }

  const colorValues = {
    "red": "bg-red-700 backdrop-blur-sm hover:bg-red-500  text-white border border-white/10 transition-all",
    "blue": "bg-blue-600 backdrop-blur-sm hover:bg-blue-500  text-white border border-white/10 transition-all",
    "black": "bg-black/50 backdrop-blur-sm hover:bg-black/10  text-white border border-white/10 transition-all",
    "light-black": "bg-black/30 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all",
    "none": "bg-none",
  }

  return (   
    <button id={id} ref={reference} type={type} onClick={onClick} className={`${sizeValues[size]} hover:cursor-pointer ${colorValues[color ?? "none"]} flex flex-col justify-center items-center gap-3 select-none`}>{icon} <h2 className="text-sm">{text}</h2></button>
  )
}

export default Button