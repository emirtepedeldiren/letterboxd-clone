import '../css/login.css'

function Login(){
    return (
        <div>
            <div className="login-container">
                <div className="login-heading">
                    <p className="ust-baslik">Please enter your information</p>
                    <h1>Welcome Back</h1>
                </div>
                <form className="form">
                    <input type="email" name="user_email" id="user_email" required placeholder="Email" className="input-field"></input>
                    <input type="password" name="password" id="password" minlength="5" maxlength="12" placeholder="Password" className="input-field"></input>
                    
                    <div className="form-row">
                        <label className="remember"><input type="checkbox"></input>Remember for 30 days</label>
                        <a href="#" className="forgot-link">Forgot password</a>
                    </div>
                    <button type="button" id="button" className="btn btn-primary">Sign in</button>
                    <button type="button" className="btn btn google"><img src="https://www.svgrepo.com/show/475656/google-color.svg" width="16" alt="G"></img>
                            Sign in with Google</button>
                    <div className="normal-signup">
                        <label className="signup">Don't you have an account? </label>
                        <a href="#" className="signup-yonlendirme">Sign up</a>
                    </div>
                </form>

            </div>
        </div>
        
    )
}

export default Login