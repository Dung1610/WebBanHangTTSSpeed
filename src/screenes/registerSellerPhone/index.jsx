import { Formik } from "formik";
import Header from "../../components/Header";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import { Login as Lg } from "../../custom/LoginProcess";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/system";
import { useNavigate } from 'react-router-dom';
import { myAxios } from "../../Services/axios";
import { Phone } from "@mui/icons-material";

const StyledContainer = styled(Container)({
  minHeight: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const StyledContainerDK = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "50px",
});

const StyledPaper = styled(Paper)({
  padding: "30px",
  maxWidth: "500px",
  textAlign: "center",
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
});

const GmailIcon = styled("img")({
  width: "100px",
  height: "100px",
  margin: "20px auto",
});

const StyledButton = styled(Button)({
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
});

const RoundedImage = styled(Box)({
  borderRadius: "60%",
  overflow: "hidden",
});

const initialValues = {
  name: "",
  phone: "",
  password: "",
  avatar: "",
  roleCode: "nguoi-ban",
};

const checkoutSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email Không Đúng Định Dạng")
    .required("Email Không Được Để Trống"),
  password: yup.string().required("Mật Khẩu Không Được Để Trống"),
});

const RegisterSellerPhone = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const [file, setFile] = useState(null);
  const [checkToken, setCheckToken] = useState("");
  const handleClose = () => {
    setStatus("idle");
    setOpenModal(false);
  };
  Lg();
  const getQueryParams = window.location.search
    .replace("?", "")
    .split("&")
    .reduce(
      (r, e) => ((r[e.split("=")[0]] = decodeURIComponent(e.split("=")[1])), r),
      {}
    );
  const Huy = () => {
    navigate('/login');
  };

  //handleFormSubmit
  const handleFormSubmit = (values) => {
    const data = {
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: "",
        roleCode: "nguoi-ban",
    };
    const formData = new FormData();
    formData.append("files", file);
    myAxios
        .post("http://localhost:5181/api/uploads", formData)
        .then((reponse) => {
          data.avatar = reponse.data[0]
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    myAxios
    .post("register", data)
    .then((reponse) => {
        console.log(reponse.data)
        // setCheckToken(reponse.data)
        handleOpen()
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const [status, setStatus] = useState("idle");

  const checkStatus = async () => {
    
  };

  return (
    <Box m="20px" textAlign="center">
      <Header
        title="Đăng Kí Tài Khoản"
        variant="h1"
      />
      <StyledContainerDK>
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
              <Box display="flex" justifyContent="center">
                  <RoundedImage>
                <Button component="label">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        setFile(e.target.files[0]);
                      }}
                    />
                    {file ? (
                      <img
                        src={URL.createObjectURL(file)}
                        style={{ width: 100, height: 100 }}
                      />
                    ) : (
                        <img
                        src="https://st5.depositphotos.com/19428878/63971/v/450/depositphotos_639712656-stock-illustration-add-profile-picture-icon-vector.jpg"
                        style={{ width: 100, height: 100 }}
                        />
                    )}
                </Button>
                    </RoundedImage>
              </Box>
              <Box
                justifyItems="center"
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                alignSelf="end"
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="Tên"
                  label="Tên Người Dùng"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  size="medium"
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="Số Điện Thoại"
                  label="Số Điện Thoại"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone}
                  name="phone"
                  size="medium"
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
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
                  sx={{
                    marginRight: "40px"
                  }}
                >
                  <Typography variant="h5" fontWeight="600">
                    Đăng kí tài khoản
                  </Typography>
                </Button>
                <Button
                  type="submit"
                  color="error"
                  variant="contained"
                  fullWidth
                  onClick={Huy}
                >
                  <Typography variant="h5" fontWeight="600">
                    Quay về trang đăng nhập
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
            </form>
          )}
        </Formik>
      </StyledContainerDK>
      <Modal open={openModal} onClose={handleClose}>
        <StyledContainer>
          <StyledPaper elevation={3}>
            <GmailIcon
              src="https://www.gstatic.com/images/branding/product/2x/gmail_2020q4_48dp.png"
              alt="Gmail Icon"
            />
            <Typography variant="h4" gutterBottom>
              Kiểm tra xác thực tài khoản
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={checkStatus}
            >
                "Check Status"
            </StyledButton>
            {status === "unverified" && (
              <>
                <Typography variant="h5" color="red" marginTop={2}>
                  ⚠️ Người dùng vẫn chưa xác thực
                </Typography>
              </>
            )}
          </StyledPaper>
        </StyledContainer>
      </Modal>
    </Box>
  );
};
export default RegisterSellerPhone;
