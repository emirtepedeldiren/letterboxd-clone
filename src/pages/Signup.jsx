import '../css/Signup.css'
import { Link } from 'react-router-dom'

function SignUp(){
    return (
        <div>
            <div className="signup-container">
                <div className="signup-heading">
                    <p className="signup-ust-baslik">Please enter your information</p>
                    <h1>Create Account</h1>
                </div>
                <form className="signup-form">
                    <input type="text" name="user_name" id="user_name" required placeholder="Name" className="signup-input"></input>
                    <input type="email" name="user_email" id="user_email" required placeholder="Email" className="signup-input"></input>
                    <input type="password" name="password" id="password" minLength="5" maxLength="12" required placeholder="Password" className="signup-input"></input>
                    <input type="password" name="password_confirm" id="password_confirm" minLength="5" maxLength="12" required placeholder="Confirm password" className="signup-input"></input>

                    <div className="signup-form-row">
                        <label className="signup-terms"><input type="checkbox" required></input><span>I agree to the <a href="#">terms</a></span></label>
                    </div>
                    <button type="button" className="signup-btn signup-btn-primary">Sign up</button>
                    <button type="button" className="signup-btn signup-btn-google"><img src="https://www.svgrepo.com/show/475656/google-color.svg" width="16" alt="G"></img>
                            Sign up with Google</button>
                    <div className="signup-footer">
                        <label>Already have an account? </label>
                        <Link to="/login" className="login-yonlendirme">Sign in</Link>
                    </div>
                </form>

            </div>
        </div>

    )
}

export default SignUp
