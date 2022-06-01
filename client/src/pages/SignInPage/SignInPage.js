import React, { useEffect, useState } from "react";
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  FormHelperText,
  Paper,
  InputLabel,
  FormControl,
  Input,
} from "@mui/material";
import Button from "@mui/material/Button";
import { LOGIN } from "../../components/../GraphQLApp/queryes";
import { useAuth } from "../../hooks/auth.hook.js";
import { AuthLoader } from "../../components/Helpers/Loader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";

const useStyles = makeStyles((theme) => ({
  label: {
    margin: "0px 8px",
  },
}));

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

export const SignInPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "j@gmail.com",
      password: "11111111",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      try {
        setLoginData({ email: values.email, password: values.password });
        resetForm({
          values: {
            email: values.email,
            password: "",
          },
        });
      } catch (e) {
        console.error("Помилочка : ", e);
      }
    },
  });

  useEffect(() => {
    if (loginData.email && loginData.password) {
      refetch();
    }
  }, [loginData]);

  const { loading, refetch } = useQuery(LOGIN, {
    //Вимкнути автоматичний логін
    skip: true,
    variables: { email: loginData.email, password: loginData.password },

    //variables: { email: 'r@gmail.com', password: '11111111' },
    onError(error) {
      // console.log(
      //   `Помилка авторизації request: ${loginData.email} ${loginData.password}
      //    отримано помилку`,
      //   error
      // );
      enqueueSnackbar("Fail login", { variant: "error" });
    },
    onCompleted(data) {
      if (data.login.status === "OK") {
        auth(data.login.record);
        enqueueSnackbar("Successful login", { variant: "success" });
        navigate("/chat");
      } else {
        // console.log("error ", data.login.error.message);
        enqueueSnackbar(data.login.error.message, { variant: "error" });
      }
    },
  });

  const prevHandleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      data-testid="sign-in"
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
          Авторизація
        </span>
        <form
          onSubmit={formik.handleSubmit}
          // Дозволяє запускати formik.handleSubmit натиском Enter над формою
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     formik.handleSubmit();
          //   }
          // }}
        >
          <Box>
            <TextField
              id="email"
              name="email"
              label="Email"
              style={{ width: "33.7vw", margin: "2vh 1vw" }}
              variant="standard"
              value={formik.values.email}
              onChange={formik.handleChange}
              inputProps={{ "data-testid": "login-email-input" }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              color="input"
              //зупиняє анімацію
              //InputLabelProps={{ shrink: true }}
              autoFocus={true}
              InputLabelProps={{
                classes: { standard: classes.label },
              }}
            />
          </Box>
          <Box>
            <FormControl
              style={{ width: "33.7vw", margin: "2vh 0vw" }}
              color="input"
              name="password"
              error={formik.touched.password && Boolean(formik.errors.password)}
            >
              <InputLabel label="Password" style={{ margin: "0px 8px" }}>
                Password
              </InputLabel>
              <Input
                id="password"
                name="password"
                label="Password"
                inputProps={{ "data-testid": "login-password-input" }}
                style={{ width: "33.7vw", marginLeft: 14, marginTop: 10 }}
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={prevHandleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {formik.touched.password && Boolean(formik.errors.password)
                  ? formik.errors.password
                  : null}
              </FormHelperText>
            </FormControl>
          </Box>
          <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              data-testid="button-login"
              size="small"
              variant="contained"
              style={{
                width: "13vw",
                margin: "15px 0px",
                color: "black",
              }}
              type="submit"
            >
              Enter
            </Button>

            <Link
              to={`/signUp`}
              data-testid="link-to-register"
              style={{
                textDecoration: "none",
                alignSelf: "center",
                color: theme.palette.primary.contrastText,
              }}
            >
              Are you is`nt registered?
            </Link>
          </Box>
          {loading ? <AuthLoader /> : null}
        </form>
      </Paper>
    </div>
  );
};
