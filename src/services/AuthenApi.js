const baseUrl = import.meta.env.VITE_API_URL;

export const SignIn = async (value) => {
  try {
    const url = `${baseUrl}/api/Auth/sign-in`;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(value),
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const RefreshToken = (accessToken, refreshToken) => {
  const url = `${baseUrl}/api/Auth/refresh-token`;
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ accessToken, refreshToken }),
  };

  return fetch(url, request)
    .then((response) => {
      if (!response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        throw new Error("Failed to refresh token");
      }
      return response.json();
    })
    .catch((err) => {
      console.error(err);
      return;
    });
};

export const GetAccountByToken = (refreshToken) => {
  const url = `${baseUrl}/account/access-token/${refreshToken}`;
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };

  return fetch(url, request)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed");
      }
      return response.json();
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const Logout = async (refreshToken) => {
  try {
    const url = `${baseUrl}/api/Auth/logout?rfToken=${refreshToken}`;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const SendOtpEmail = async (email) => {
  try {
    const url = `${baseUrl}/api/Email/otp-email?email=${email}`;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const CheckOtp = async (email, otp) => {
  try {
    const url = `${baseUrl}/api/Account/otp-verifying?email=${email}&otp=${otp}`;
    const request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const ChangePassword = async (password, confirmedPassword, email) => {
  try {
    const url = `${baseUrl}/api/Account/password`;
    const bodyJson = {
      password: password,
      confirmedPassword: confirmedPassword,
      email: email,
    };
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(bodyJson),
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const CheckOldPassword = async (oldPassword, email) => {
  try {
    const url = `${baseUrl}/api/Auth/old-password`;
    const bodyJson = {
      password: oldPassword,
      email: email,
    };
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(bodyJson),
    };
    const response = await fetch(url, request);
    return response;
  } catch (err) {
    console.log(err);
  }
};
