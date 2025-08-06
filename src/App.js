import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import './App.css';

const schema = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  password: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("senha"), null], "As senhas devem coincidir")
    .required("Confirmação de senha é obrigatória")
});

export default function App() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const formValues = watch();

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  };

  const onSubmit = async (data) => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      setSubmitted(true);
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return <h3>Cadastro realizado com sucesso! 🎉</h3>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Nome:</label><br />
          <input {...register("nome")} />
          {errors.nome && <p style={{ color: "red" }}>{errors.nome}</p>}
        </div>

        <div>
          <label>E-mail:</label><br />
          <input {...register("email")} />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div>
          <label>Telefone:</label><br />
          <input
            {...register("phone")}
            value={formValues.phone || ""}
            onChange={(e) => setValue("phone", formatTelefone(e.target.value))}
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
        </div>

        <div>
          <label>Senha:</label><br />
          <input type="password" {...register("password")} />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>

        <div>
          <label>Confirmar Senha:</label><br />
          <input type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>Cadastrar</button>
      </form>
    </div>
  );
}
