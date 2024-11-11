import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { EToastType, showToast } from "../../app/toast";
import ErrorText from "../../components/Typography/ErrorText";
import {
  login,
  resetLoginResult,
  selectAuthState,
} from "../../redux/authSlice";

const validationSchema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập!"),
  password: yup.string().required("Vui lòng nhập mật khẩu!"),
});

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginResult } = useSelector(selectAuthState);

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const submitForm = (data) => {
    setLoading(true);
    dispatch(login(data));
    setLoading(false);
  };

  useEffect(() => {
    if (loginResult) {
      if (loginResult === "success") {
        showToast("Đăng nhập thành công!", EToastType.SUCCESS);
        navigate("/");
      } else {
        showToast("Sai tên đăng nhập hoặc mật khẩu!", EToastType.ERROR);
      }

      dispatch(resetLoginResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginResult]);

  return (
    <div className="flex items-center min-h-screen bg-base-200">
      <div className="w-full max-w-2xl mx-auto shadow-xl card">
        <div className="grid grid-cols-1 bg-base-100 rounded-xl">
          <div className="px-10 py-24">
            <h2 className="mb-2 text-2xl font-semibold text-center">
              Đăng nhập
            </h2>
            <form onSubmit={handleSubmit(submitForm)}>
              <div className="mb-4">
                <div className="w-full mt-4 form-control">
                  <label className="label">
                    <span className="label-text text-base-content">
                      Tên đăng nhập
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập email"
                    className="w-full input input-bordered"
                    autoComplete="off"
                    {...register("username")}
                  />
                </div>

                <div className="w-full mt-4 form-control">
                  <label className="label">
                    <span className="label-text text-base-content">
                      Mật khẩu
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full input input-bordered"
                    autoComplete="off"
                    {...register("password")}
                  />
                </div>
              </div>

              <ErrorText styleClass="my-4">
                {errors?.username?.message || errors?.password?.message}
              </ErrorText>
              <button
                type="submit"
                className={
                  "btn w-full btn-primary xl:text-lg" +
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
