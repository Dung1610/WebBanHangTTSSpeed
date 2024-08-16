const NoLogin = () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
  }
};

const Login = () => {
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("role") == "quan-tri-vien") {
      window.location.href = "/";
    } else {
      window.location.href = "/seller";
    }
  }
};

const CheckRoleInSeller = () => {
  if(localStorage.getItem("role") == "quan-tri-vien") {
    window.location.href = "/notfound";
  }
}

const CheckRoleInAdmin = () => {
  if(localStorage.getItem("role") == "nguoi-ban") {
    window.location.href = "/notfound";
  }
}

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
        localStorage.removeItem("role");
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
        localStorage.removeItem("role");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
      if (data.status === 200) {
        if (data.data.roleCode == "nguoi-ban") {
          localStorage.setItem("role", data.data.roleCode);
        }
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
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
export { NoLogin, Login, CheckExpired , CheckRoleInSeller, CheckRoleInAdmin};
