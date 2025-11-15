import { useState, useEffect } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { saveUser } from '../redux/user/userSlice'

function Login(props) {

    // redux
    const dispatch = useDispatch()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [loginEmail, setLoginEmail] = useState({
        email: '',
        class: ''
    })
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [loginPwd, setLoginPwd] = useState({
        pwd: '',
        class: ''
    })
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const [btnClass, setBtnClass] = useState('btn_locked')


    // validation
    // email
    useEffect(() => {
        if (loginEmail.email.length > 0 && !emailRegex.test(loginEmail.email)) {
            setLoginEmail(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setLoginEmail(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [loginEmail.email])

    // password
    useEffect(() => {
        if (loginPwd.pwd.length > 0 && !pwdRegex.test(loginPwd.pwd)) {
            setLoginPwd(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setLoginPwd(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [loginPwd.pwd])

    // lock/unlock form button
    function FN_formLock() {
        if (emailRegex.test(loginEmail.email) && pwdRegex.test(loginPwd.pwd)) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }

    // login
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Login', loginEmail: loginEmail.email, loginPwd: loginPwd.pwd})
            .then(results => FN_loginResponse(results.data))
            .catch(err => {
                setFormError(true)
                toast.error('Error: ' + err)
            })
            .finally(setFormLoading(false))
    }

    function FN_loginResponse(result) {
        if (typeof result === 'object') {
            dispatch(saveUser(result))
            toast.success('Login successful')
        } else {
            if (result === 'error email') {
                toast.error('Invalid email address submitted')
                setLoginPwd(prev => ({...prev, pwd:''}))
            } else if (result === 'error pwd') {
                toast.error('Invalid password submitted')
                setLoginPwd(prev => ({...prev, pwd:''}))
            } else if (result === 'error not found') {
                toast.error('Login not recognised')
                setLoginPwd(prev => ({...prev, pwd:''}))
            } else {
                toast.error('Login unsuccessful')
                setLoginEmail(prev => ({...prev, email:''}))
                setLoginPwd(prev => ({...prev, pwd:''}))
                console.log(result)
            }
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_ttl">Login</div>
                <div className="popup_pad popup_pnl_v1"> 
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="loginEmail">Email (username)</label>
                                    <span className={loginEmail.class}>
                                        <input type="text" name="loginEmail" id="loginEmail" value={loginEmail.email} onChange={(e) => setLoginEmail(prev => ({...prev, email:e.target.value}))} />
                                        <span className="ipt_hint_msg">name@domain.com</span>
                                    </span>
                                </p>
                                <p>
                                    <label htmlFor="loginPwd">Password</label>
                                    <span className={loginPwd.class}>
                                        <input type="password" name="loginPwd" id="loginPwd" value={loginPwd.pwd} onChange={(e) => setLoginPwd(prev => ({...prev, pwd:e.target.value}))} />
                                        <span className="ipt_hint_msg">Min 8 lowercase, UPPERCASE, numbers & special characters</span>
                                    </span>
                                </p>
                                <p className={btnClass}><button className="btn_blue">Login</button></p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Login