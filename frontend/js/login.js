
async function handleLogin() {
  const userIdInput = document.getElementById("user-id");
  const passwordInput = document.getElementById("password");

  const userId = userIdInput.value;
  const password = passwordInput.value;

  const user = { userId, password };

  // server returns an array with a single object or no object
  const userInfo = await fetchUserInfo(user);

  const errorElement = document.getElementById("user-login-error");

  //user data did not match
  if (userInfo?.length === 0) {
    errorElement.classList.remove("hidden");
  } else {
    errorElement.classList.add("hidden");

    //save user information before jumping to next page
     localStorage.setItem("loggedInUser", JSON.stringify(userInfo[0]));
     //then make jump
     window.location.href = "/post.html";
  }
};

const fetchUserInfo = async (user) => {
  let data;
  try {
    const res = await fetch("http://localhost:5000/getUserInfo", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    data = await res.json();
  } catch (err) {
    console.log("error: ", err);
  } finally {
    console.log(data);
    return data;
  }
};
