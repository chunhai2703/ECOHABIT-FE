import { createContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { isValidToken, setSession } from "../utils/jwt";
import { toast } from "react-toastify";
import { GetAccountByToken, SignIn } from "../services/AuthenApi";
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  user: {},
  method: "jwt",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        const refreshToken = window.localStorage.getItem("refreshToken");

        if (accessToken && refreshToken && isValidToken(accessToken)) {
          setSession(accessToken, refreshToken);

          const response = await GetAccountByToken(accessToken);

          const user  = response.result;
          console.log(user)

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          setSession(null, refreshToken);
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    console.log(username)
    const response = await SignIn({
      userName: username,
      password: password,
    });

    if (response.ok) {
      const responseData = await response.json()
      const { accessToken } = responseData.result;
      const { refreshToken } = responseData.result;
      const { user } = responseData.result;

      setSession(accessToken, refreshToken);
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });
      toast.success("Đăng nhập thành công");
      window.location.reload();
      return;
    } else {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
    }
  };

  const logout = async () => {
    setSession(null, null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
