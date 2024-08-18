import { Box, Button, styled, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import firebase from "../../custom/firebase";


const FormInput = styled(Box)(() => ({
  display: "flex",
  gap: "12px",
}));

const FormOtp = styled(Box)(() => ({
  display: "flex",
  gap: "24px",
  flexDirection: "column",
  margin: "100px",
}));

function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const setUpRecapcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        defaultCountry: "VN",
      }
    );
  };

  const handleSendOtp = async () => {
    const appVerify = window.recaptchaVerifier;
    await firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerify)
      .then((confirmation) => {
        window.confirmationResult = confirmation;
        alert("Da gui otp thanh cong");
      })
      .catch((error) => {
        console.error(error);
        alert("Da gui otp that bai");
      });
  };

  const handleVerify = () => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        alert("Xac thuc thanh cong");
      })
      .catch((error) => {
        alert("Xac thuc that bai");
      });
  };



  useEffect(() => {
    setUpRecapcha();
  }, []);
  return (
    <>
      <FormOtp>
        <FormInput>
          <TextField
            variant="outlined"
            label="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendOtp}>
            Send Otp
          </Button>
        </FormInput>
        <FormInput>
          <TextField
            variant="outlined"
            label="Otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" onClick={handleVerify}>
            Verify
          </Button>
        </FormInput>
      </FormOtp>

      <div id="sign-in-button"></div>
    </>
  );
}

export default PhoneAuth;
