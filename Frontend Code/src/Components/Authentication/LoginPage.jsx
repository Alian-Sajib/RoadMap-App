import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import './LoginPage.css';
import { auth } from "../../redux/authactionTypes";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const authLoading = useSelector(state => state.authLoading)
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup && password != confirmPass)
            alert("Password is not match...")
        else {
            // console.log('Logging in with:', { email, password });
            dispatch(auth(email, password, isSignup))
        }

    };

    const modeSwitch = () => {
        setIsSignup((prev) => !prev) // take the previous state and toggle it
    }

    return (
        <div>
            <center>
                <h2>Welcome to Road Map App...</h2>
                <br />
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isSignup && (
                        <div >
                            <label> Confirm Password:</label>
                            <input
                                className="login-form input"
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                required
                            />
                        </div>

                    )

                    }

                    <button type="submit" disabled={authLoading}>
                        {authLoading ? 'Submitting...' : isSignup ? 'Sign Up' : 'Login'}
                    </button>
                    <br />
                    <p onClick={modeSwitch}><a style={{ cursor: "pointer", textDecoration: 'underline' }}>
                        {isSignup ? 'Switch to Login' : "Switch to Sign up"}</a></p>

                </form>
            </center>
        </div>
    );
}

export default LoginPage