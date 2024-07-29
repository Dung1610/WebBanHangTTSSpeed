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
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?tokenExpired=true";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
export { NoLogin, Login , CheckExpired};
