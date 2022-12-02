import axios from "axios";
import { useState } from "react";

const UserAuthentication = ({setLoggedIn, setUserId}) => {
    const [showSignIn, setShowSignIn] = useState(true);

    let display;
    if(showSignIn) {
        display = <LoginForm setShowSignIn={setShowSignIn} setLoggedIn={setLoggedIn} setUserId={setUserId} />
    } else {
        display = <SignUpForm setShowSignIn={setShowSignIn} />
    }

    return (
        <div className="main-content-container flex justify-center items-center">
            {display}
        </div>
    );
}

const LoginForm = ({setShowSignIn, setLoggedIn, setUserId}) => {
    const logIn = e => {
        e.preventDefault();
        let inputs = document.querySelectorAll('input');
        let reqBody = {};
        reqBody.username = inputs[0].value;
        reqBody.password = inputs[1].value;

        axios.post("/api/auth/signin", reqBody)
            .then(res => {
                setUserId(Number(res.data));
                setLoggedIn(true);
            })
            .catch(err => {
                inputs.forEach(input => input.value = "");
            });
    }

    const navToRegistration = () => {
        setShowSignIn(false);
    }

    return (
        <div>
            <form className="user-auth-form">
                <h2 className="user-auth-header">Sign In</h2>
                <label htmlFor="username">Username:</label>
                <input type="text" required id="username" />
                <label htmlFor="password">Password:</label>
                <input type="password" required id="password" />
                <button onClick={logIn}>Log In</button>
            </form>

            <div className="change-form-prompt">
                <span>Don't have an account?</span><button onClick={navToRegistration} className="change-form-btn">Register</button>
            </div>
        </div>
    );
}

const SignUpForm = ({setShowSignIn}) => {
    const register = e => {
        e.preventDefault();
        let inputs = document.querySelectorAll('input');
        let reqBody = {};
        reqBody.username = inputs[0].value;
        reqBody.password = inputs[1].value;

        axios.post("/api/auth/signup", reqBody)
            .then(res => {
                alert(res.data);
                navToLoginPage();
            })
            .catch(err => {
                alert(err.response.data);
                inputs.forEach(input => input.value = "");
            });
    }

    const navToLoginPage = () => {
        setShowSignIn(true);
    }

    return (
        <div>
            <form className="user-auth-form">
                <h2 className="user-auth-header">Register</h2>
                <label htmlFor="username">Username:</label>
                <input type="text" required id="username" />
                <label htmlFor="password">Password:</label>
                <input type="password" required id="password" />
                <button onClick={register}>Register</button>
            </form>

            <div className="change-form-prompt">
                <span>Already have an account?</span><button onClick={navToLoginPage} className="change-form-btn">Sign In</button>
            </div>
        </div>
    )
}

export default UserAuthentication;