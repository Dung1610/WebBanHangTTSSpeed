const NoLogin = () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }
};

const Login = () => {
  if (localStorage.getItem("token")) {
    window.location.href = "/";
  }
};

const CheckExpired = () => {
  fetch("http://localhost:5181/api/users/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: localStorage.getItem("token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        console.log("Token het han");
        RefreshToken();
      }
      if (data.status === 200) {
        console.log("token con han");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const RefreshToken = () => {
  fetch("http://localhost:5181/api/users/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
      if (data.status === 200) {
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
        console.log("refresh-token con han");
        console.log("lay token moi");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export { NoLogin, Login, CheckExpired };
