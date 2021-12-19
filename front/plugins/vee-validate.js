import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("email", {
  ...email,
  message: "Invalid e-mail.",
});

extend("required", {
  ...required,
  message: "This field is required",
});

extend("required", {
  ...required,
  message: "This field is required",
});

extend("max", {
  validate(value, { max }) {
    const length = value.length;
    return length <= max;
  },
  params: ["max"],
  message: "Max {max} characters",
});

extend("minmax", {
  validate(value, { min, max }) {
    const length = value.length;
    return min <= length && length <= max;
  },
  params: ["min", "max"],
  message: "The {_field_} must have {min} ~ {max}",
});

extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password does not same",
});
