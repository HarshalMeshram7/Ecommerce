import React, { Fragment, useState, useRef, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { login, register } from "../../request/userRequest";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../assets/css/register.css';

const LoginRegister = (props) => {
  // Login
  const [email, setEmail] = useState("admin");
  const [pass, setPass] = useState("admin");
  const handleLogin = (e) => {
    e.preventDefault();
    let data = {
      email: email,
      password: pass
    }
    login(data).then((res) => {
      if (res.token !== undefined) {
        localStorage.setItem("token", res.token);
        props.onHandleToken(localStorage.getItem("token"))
      } else {
        alert("Email or Password is incorrect")
      }
    })
  }
  // Register
  const USER_REGEX = /^[A-z][A-z0-9-_@.]{3,30}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])

  const handleSubmit = (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    let data = {
      email: user,
      password: pwd
    }
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      register(data).then((response) => {
        console.log(JSON.stringify(response))
        if (response !== undefined) {
          if (response.response_status === "409") {
            alert("User Already Exist With this Email")
          } else if (response.token !== undefined) {
            localStorage.setItem("token", response.token);
            props.onHandleToken(localStorage.getItem("token"))
            setSuccess(true); 
          }
        } else {
          alert("No Response From Server !Please Check Your Internet")
        }
        setUser('');
        setPwd('');
        setMatchPwd('');
      })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed')
      }
      errRef.current.focus();
    }
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Flone | Login</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <h1>Login</h1>
                            <form onSubmit={handleLogin}>
                              <label htmlFor="email">
                                Email:
                              </label>
                              <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                name="email"
                                placeholder="email"
                                value={email}
                                id="email"
                              />
                              <label htmlFor="pass">
                                Password:
                              </label>
                              <input
                                id="pass"
                                onChange={(e) => setPass(e.target.value)}
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={pass}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/reset_password"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <button type="submit" >
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>

                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <>
                              {success ? (
                                <section>
                                  <h1>Registered Successfully! Please Login Again</h1>
                                  <Link to={process.env.PUBLIC_URL + "/LoginRegister"}>
                                    Login
                                  </Link>
                                </section>
                              ) : (
                                <>
                                  <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                                  <h1>Register</h1>
                                  <form onSubmit={handleSubmit}>
                                    <label htmlFor="username">
                                      Email:
                                      <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                      <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                                    </label>
                                    <input
                                      type="email"
                                      id="username"
                                      ref={userRef}
                                      autoComplete="off"
                                      onChange={(e) => setUser(e.target.value)}
                                      value={user}
                                      required
                                      aria-invalid={validName ? "false" : "true"}
                                      aria-describedby="uidnote"
                                      onFocus={() => setUserFocus(true)}
                                      onBlur={() => setUserFocus(false)}
                                      placeholder="Your Email"
                                    />
                                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                      <FontAwesomeIcon icon={faInfoCircle} />
                                      4 to 24 characters.<br />
                                      Must begin with a letter.<br />
                                      Letters, numbers, underscores, hyphens allowed.
                                    </p>


                                    <label htmlFor="password">
                                      Password:
                                      <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                      <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                    </label>
                                    <input
                                      type="password"
                                      id="password"
                                      onChange={(e) => setPwd(e.target.value)}
                                      value={pwd}
                                      required
                                      aria-invalid={validPwd ? "false" : "true"}
                                      aria-describedby="pwdnote"
                                      onFocus={() => setPwdFocus(true)}
                                      onBlur={() => setPwdFocus(false)}
                                      placeholder="Your Password"
                                    />
                                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                      <FontAwesomeIcon icon={faInfoCircle} />
                                      8 to 24 characters.<br />
                                      Must include uppercase and lowercase letters, a number and a special character.<br />
                                      Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                    </p>


                                    <label htmlFor="confirm_pwd">
                                      Confirm Password:
                                      <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                      <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                    </label>
                                    <input
                                      type="password"
                                      id="confirm_pwd"
                                      onChange={(e) => setMatchPwd(e.target.value)}
                                      value={matchPwd}
                                      required
                                      aria-invalid={validMatch ? "false" : "true"}
                                      aria-describedby="confirmnote"
                                      onFocus={() => setMatchFocus(true)}
                                      onBlur={() => setMatchFocus(false)}
                                      placeholder="Confirm Password"
                                    />
                                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                      <FontAwesomeIcon icon={faInfoCircle} />
                                      Must match the first password input field.
                                    </p>
                                    <div className="button-box">
                                      <button disabled={!validName || !validPwd || !validMatch ? true : false}><span>Register</span></button>
                                    </div>
                                  </form>
                                </>
                              )}
                            </>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};
export default LoginRegister;
