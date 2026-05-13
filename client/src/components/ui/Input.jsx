export default function Input({ label, error, ...props }) {
  const id = props.id || props.name;
  return (
    <div className="field">
      {label ? (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <input className={`input ${error ? "input-error" : ""}`} id={id} {...props} />
      {error ? <div className="field-error">{error}</div> : null}
    </div>
  );
}

// TODO: add password reveal toggle component

