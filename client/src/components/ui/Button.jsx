export default function Button({
  as: Component = "button",
  variant = "solid",
  className = "",
  ...props
}) {
  const variantClass =
    variant === "ghost" ? "btn btn-ghost" : variant === "outline" ? "btn btn-outline" : "btn btn-solid";
  return <Component className={`${variantClass} ${className}`.trim()} {...props} />;
}

// TODO: add loading state + disabled styling variants

