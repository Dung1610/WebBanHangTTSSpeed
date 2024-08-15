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
  email: yup.string().email("Email Không Đúng Định Dạng").required("Email Không Được Để Trống"),
  password: yup.string().required("Mật Khẩu Không Được Để Trống"),
});

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isLoading, setIsLoading] = useState(false);
  const [thongBao, setThongBao] = useState(null);
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
        if (data.status == 200) {
          if (data.data.roleCode == "quan-tri-vien") {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("refreshToken", data.data.user.refreshToken);
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
          }else if(data.data.roleCode == "nguoi-ban"){
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("role", data.data.roleCode);
            localStorage.setItem("refreshToken", data.data.user.refreshToken);
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
            window.location.href = "/seller";
          }else {
            setThongBao("Bạn không có quyền truy cập trang này!")
          }
          setThongBao(null)
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setThongBao("Tài Khoản Hoặc Mật Khẩu Không Chính Xác!")
        }
      })
      .catch((error) => {
        setThongBao("Lỗi sever!!!!")
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
                size="medium"
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
                size="medium"
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
            {thongBao && (
              <Alert
                variant="outlined"
                severity="error"
                sx={{
                  m: "20px 200px 20px 200px",
                  fontSize: "1em",
                }}
              >
                {thongBao}
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
