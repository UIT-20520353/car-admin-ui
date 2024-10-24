import { useState } from "react";
import { useNavigate } from "react-router-dom";
import appConstant from "../../app/constant";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";

function Login() {
  const navigate = useNavigate();
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required! (use any value)");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required! (use any value)");
    else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      localStorage.setItem(appConstant.TOKEN_KEY, "DumyTokenHere");
      setLoading(false);
      navigate("/");
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="flex items-center min-h-screen bg-base-200">
      <div className="w-full max-w-2xl mx-auto shadow-xl card">
        <div className="grid grid-cols-1 bg-base-100 rounded-xl">
          <div className="px-10 py-24">
            <h2 className="mb-2 text-2xl font-semibold text-center">
              Đăng nhập
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="emailId"
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email"
                  updateFormValue={updateFormValue}
                  placeholder="Nhập email"
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Mật khẩu"
                  updateFormValue={updateFormValue}
                  placeholder="Nhập mật khẩu"
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary xl:text-lg" +
                  (loading ? " loading" : "")
                }
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
