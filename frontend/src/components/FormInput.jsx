
function FormInput({ label, type, value, onChange, placeholder }) {

  return (
    <div className="form-input">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

    </div>
  );
}

export default FormInput;

