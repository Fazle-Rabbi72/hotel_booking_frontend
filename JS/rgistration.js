const handelRegistration = (event) => {
  event.preventDefault();
  const username = getvalue("username");
  const first_name = getvalue("first_name");
  const last_name = getvalue("last_name");
  const email = getvalue("email");
  const password = getvalue("password");
  const confirm_password = getvalue("confirm_password");
  const info = {
    username,
    first_name,
    last_name,
    email,
    password,
    confirm_password,
  };
  if (password === confirm_password) {
    document.getElementById("error").innerText = "";
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      console.log(info);
      fetch("https://natures-paradise-stlb.onrender.com/register/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          if (data.token && data.uid) {
            // Redirect to the verification page
            window.location.href = `../HTML/verifyUser.html?uid=${data.uid}&token=${data.token}`;
          } else {
            document.getElementById("error").innerText = data.message;
          }
        });
    } else {
      document.getElementById("error").innerText =
        "Password must be at least eight characters, including one uppercase letter, one lowercase letter, one number, and one special character";
    }
  } else {
    document.getElementById("error").innerText =
      "Password and confirm password do not match";
    alert("Password and confirm password do not match");
  }
};

const getvalue = (id) => {
  const value = document.getElementById(id).value;
  return value;
};
