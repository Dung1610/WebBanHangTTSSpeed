import { Formik } from "formik";
import Header from "../../components/Header";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Login as Lg } from "../../custom/LoginProcess";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const initialValues = {
  email: "",
  password: "",
};

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [isLoading, setIsLoading] = useState(false);
  Lg();
  const getQueryParams = window.location.search
    .replace("?", "")
    .split("&")
    .reduce(
      (r, e) => ((r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1])), r),
      {}
    );

  //handleFormSubmit
  const handleFormSubmit = (values) => {
    const data = {
      username: values.email,
      password: values.password,
    };

    setIsLoading(true);

    // Add your authentication logic here
    fetch("http://localhost:5181/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data.user);
        if (data.status == 200) {
          if (data.data.roleCode == "quan-tri-vien") {
            localStorage.setItem("token", data.data.token);
            if (data.data.user.email != null) {
              localStorage.setItem("user", data.data.user.email);
            } else {
              localStorage.setItem("user", data.data.user.phone);
            }
            if (data.data.user.name != null) {
              localStorage.setItem("name", data.data.user.name);
            } else {
              localStorage.setItem("name", "Admin");
            }
            window.location.href = "/";
          } else {
            alert("Bạn không có quyền truy cập trang này!");
          }
          setIsLoading(false);
        } else {
          alert(data.message);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <Box m="20px" textAlign="center">
      <Header
        title="LOGIN [ FOR ADIM ]"
        subtitle="This is page for admin of speed ecommerce"
        variant="h1"
      />
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              justifyItems="center"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              alignSelf="end"
              padding="20px 200px 20px 200px"
            >
              <TextField
                fullWidth
                variant="filled"
                type="Email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
              
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              mt="20px"
              padding="20px 200px 20px 200px"
            >
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                fullWidth
                disabled={isLoading ? true : false}
              >
                <Typography variant="h5" fontWeight="600">
                  Login
                </Typography>
              </Button>
            </Box>

            {getQueryParams.tokenExpired && (
              <Alert
                variant="outlined"
                severity="error"
                sx={{
                  m: "20px 200px 20px 200px",
                  fontSize: "1em",
                }}
              >
                Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!
              </Alert>
            )}

            {isLoading && (
              <Stack
                sx={{
                  width: "100%",
                  color: "grey.500",
                  padding: "20px 200px 20px 200px",
                }}
                spacing={2}
                mt="-40px"
              >
                <LinearProgress color="success" />
              </Stack>
            )}
          </form>
        )}
      </Formik>
    </Box>
  );
};
export default Login;
