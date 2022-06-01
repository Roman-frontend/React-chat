import React, { useRef, memo } from "react";
import { gql, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { useValidate } from "../../hooks/validate.hook.js";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../components/Helpers/validateMethods/validateMethods.jsx";
import { useAuth } from "../../hooks/auth.hook.js";
import { SignUpForm } from "../../components/SignUpForm/SignUpForm.jsx";
import { REGISTER } from "../../components/../GraphQLApp/queryes";
import { AuthLoader } from "../../components/Helpers/Loader.jsx";
import MuiLink from "@mui/material/Link";
import "./auth-body.sass";

export const SignUpPage = memo(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { auth } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { errors, validate } = useValidate({
    name: validateName,
    email: validateEmail,
    password: validatePassword,
  });

  const ref = {
    name: useRef(undefined),
    email: useRef(undefined),
    password: useRef(undefined),
  };

  const [register, { loading }] = useMutation(REGISTER, {
    update(cache, { data: { register } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: register.record,
              fragment: gql`
                fragment NewUser on User {
                  id
                  name
                  email
                }
              `,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    },
    onError(error) {
      console.log(`Некоректні дані при реєстрації ${error}`);
      enqueueSnackbar("Failed registration!", { variant: "error" });
    },
    onCompleted(data) {
      if (data.register.status === "OK") {
        auth(data.register.record);
        navigate("/chat");
        enqueueSnackbar(data.register.error.message, { variant: "success" });
      } else {
        enqueueSnackbar(data.register.error.message, { variant: "error" });
      }
    },
  });

  const handleSubmit = async () => {
    const formData = {
      name: ref.name.current.children[1].children[0].value,
      email: ref.email.current.children[1].children[0].value,
      password: String(ref.password.current.children[1].children[0].value),
    };
    ref.password.current.children[1].children[0].value = "";
    const isValidForm = validate(formData);
    if (isValidForm) {
      register({ variables: { ...formData } });
    }
  };

  return (
    <div
      data-testid="sign-up"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Paper
        sx={{
          position: "relative",
          top: "15vh",
          background: theme.palette.primary.dark,
        }}
      >
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 25,
            margin: "20px 0px 0px",
          }}
        >
          Реєстрація
        </span>

        <SignUpForm
          label="Name"
          placeholder="Введите имя"
          name="name"
          autoFocus={true}
          fieldError={errors.name}
          type="name"
          inputSignUpRef={ref.name}
        />
        <SignUpForm
          label="Email"
          placeholder="Введите email"
          name="email"
          fieldError={errors.email}
          type="email"
          inputSignUpRef={ref.email}
        />
        <SignUpForm
          label="Password"
          placeholder="Введите пароль"
          name="password"
          fieldError={errors.password}
          type="password"
          inputSignUpRef={ref.password}
        />

        <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            style={{
              width: "13vw",
              margin: "15px",
            }}
            onClick={handleSubmit}
          >
            Register
          </Button>

          <Link
            data-testid="link-to-login"
            to={`/signIn`}
            style={{
              textDecoration: "none",
              alignSelf: "center",
              color: theme.palette.primary.contrastText,
            }}
          >
            Are you is registered?
          </Link>
        </Box>

        {loading ? <AuthLoader /> : null}
      </Paper>
    </div>
  );
});

export default SignUpPage;
