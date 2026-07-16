import { useEffect, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import Logo from "@/Assets/Img/logo-vista-media.png";

import { api } from "@/apiService";

import Svg from "@/Components/Svg";
import SpinSvg from "@/Assets/Svg/SpinSvg";

export default function Login() {
    const usernameRef = useRef();
    const errorRef = useRef();

    const [getErrors, setGetErrors] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGetErrors("");
        try {
            setProcessing(true);
            const response = await api.post(
                "/api/login",
                JSON.stringify({ username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                },
            );
            const accessToken = response?.data?.token;
            const user = response?.data?.user;
            localStorage.setItem("token", accessToken);
            localStorage.setItem("dataUser", JSON.stringify(user));
            router.visit("/dashboard");
        } catch (err) {
            setProcessing(false);
            if (!err?.response) {
                setErrorMessage("No Server Response..!!");
            } else if (err.response?.status === 401) {
                setErrorMessage("Unauthorized..!!");
            } else {
                setGetErrors(err.response.data.errors);
                setErrorMessage("Login Failed..!!");
            }
        }
    };

    return (
        <>
            <Head title="Login" />
            <section>
                <div className="flex-all-center w-full h-screen top-0 bg-stone-900">
                    <div className="m-auto w-80 bg-stone-700 border border-stone-100 p-10 rounded-xl drop-shadow-xl">
                        <div className="drop-shadow-lg m-auto w-24 h-24 flex bg-white rounded-full border border-slate-400 p-1">
                            <div className="flex-al-center drop-shadow-md m-auto rounded-full border border-slate-300">
                                <img
                                    src={Logo}
                                    alt=""
                                    className="flex w-full h-full"
                                />
                            </div>
                        </div>

                        <div className="m-auto flex-all-center p-2">
                            <h2 className="tracking-widest font-bold text-xl text-stone-100">
                                Please Login
                            </h2>
                        </div>

                        <div
                            ref={errorRef}
                            className={
                                errorMessage
                                    ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                                    : "hidden"
                            }
                            aria-live="assertive"
                        >
                            {errorMessage}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex-all-center m-auto">
                                <div>
                                    <input
                                        type="text"
                                        className="flex mt-6 p-2 h-8 w-48"
                                        placeholder="username"
                                        ref={usernameRef}
                                        autoComplete="off"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        value={username}
                                    />
                                    {getErrors.username && (
                                        <span
                                            ref={errorRef}
                                            className={
                                                errorMessage
                                                    ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                                                    : "hidden"
                                            }
                                        >
                                            {getErrors.username}
                                        </span>
                                    )}
                                    <input
                                        type="password"
                                        className="flex mt-6 p-2 h-8 w-48"
                                        placeholder="password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        value={password}
                                    />
                                    {getErrors.password && (
                                        <span
                                            ref={errorRef}
                                            className={
                                                errorMessage
                                                    ? "flex-all-center m-auto w-full text-red-500 text-xs items-center"
                                                    : "hidden"
                                            }
                                        >
                                            {getErrors.password}
                                        </span>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={
                                            processing
                                                ? "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-10 drop-shadow-xl rounded-2xl p-2 button-disabled cursor-pointer"
                                                : "flex justify-center items-center w-48 m-auto font-semibold tracking-widest mt-10 drop-shadow-xl rounded-2xl p-2 button-primary cursor-pointer"
                                        }
                                    >
                                        {processing && (
                                            <Svg
                                                title="Spin"
                                                c={
                                                    "w-5 fill-current mx-2 animate-spin"
                                                }
                                            >
                                                <SpinSvg />
                                            </Svg>
                                        )}
                                        <span>Login</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
