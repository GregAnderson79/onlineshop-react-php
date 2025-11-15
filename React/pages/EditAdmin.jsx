import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function EditAdmin(props) {

    // navigate
    const navigate = useNavigate()

    // admin ID
    const { adminID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [adminName, setAdminName] = useState({
        name: '',
        class: ''
    })
    const [adminEmail, setAdminEmail] = useState({
        email: '',
        class: ''
    })
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [adminPwd, setAdminPwd] = useState({
        pwd: '',
        class: ''
    })
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
    const [btnClass, setBtnClass] = useState("btn_locked")


    // validation
    // name
    useEffect(() => {
        if (adminName.name.length > 0 && adminName.name.length < 3) {
            setAdminName(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setAdminName(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [adminName.name])

    // email
    useEffect(() => {
        if (adminEmail.email.length > 0 && !emailRegex.test(adminEmail.email)) {
            setAdminEmail(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setAdminEmail(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [adminEmail.email])

    // password
    useEffect(() => {
        if (adminPwd.pwd.length > 0 && !pwdRegex.test(adminPwd.pwd)) {
            setAdminPwd(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setAdminPwd(prev => ({...prev, class:''}))
        }
        FN_formLock()
    }, [adminPwd.pwd])

    // lock/unlock form button
    function FN_formLock() {
        if (adminName.name.length >= 3 && emailRegex.test(adminEmail.email) && pwdRegex.test(adminPwd.pwd)) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }


    // get admin data
    useEffect(() => {
        async function FN_apiGetAdminData() {
            setFormLoading(true)
            await axios.post(props.apiURL, {func: 'Get Admin', adminID: adminID})
                .then(results => FN_useAdminData(results.data))
                .catch(err => {
                    setFormError(true)
                    toast.error("Error: " + err)
                })
            setFormLoading(false)
        }
        FN_apiGetAdminData()
    }, [])

    // use option data
    function FN_useAdminData(data) {
        if (typeof data === 'undefined' || data === null) {
            setFormError(true)
            toast.error('Admin could not be found')
        } else {
            setAdminName(prev => ({...prev, name:data.adminName}))
            setAdminEmail(prev => ({...prev, email:data.adminEmail}))
            setAdminPwd(prev => ({...prev, pwd:data.adminPwd}))
        }
    }


    // API update admin
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Update Admin', adminName: adminName.name, adminEmail: adminEmail.email, adminPwd: adminPwd.pwd, adminID: adminID})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'updated') {
            toast.success('Admin updated')
            return navigate('/admins')
        } else if (result === 'error name') {
            toast.error('Admin name must be minimum 2 words and 5 characters')
        } else if (result === 'error email') {
            toast.error('Admin email address must use the name@domain.com format')
        } else if (result === 'error pwd') {
            toast.error('Admin password must contain 8 or more lowercase, UPPERCASE, numbers & special characters')
        } else {
            toast.error('Admin account could not be added')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Edit admin</div>
                <div className="popup_pad popup_pnl_v2">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="adminName">Name</label>
                                    <span className={adminName.class}>
                                        <input type="text" name="adminName" id="adminName" value={adminName.name} onChange={(e) => setAdminName(prev => ({...prev, name:e.target.value}))} />
                                        <span className="ipt_hint_msg">Minimum 3 characters</span>
                                    </span>
                                </p>
                                <p>
                                    <label htmlFor="adminEmail">Email (username)</label>
                                    <span className={adminEmail.class}>
                                        <input type="text" name="adminEmail" id="adminEmail" value={adminEmail.email} onChange={(e) => setAdminEmail(prev => ({...prev, email:e.target.value}))} />
                                        <span className="ipt_hint_msg">name@domain.com</span>
                                    </span>
                                </p>
                                <p>
                                    <label htmlFor="adminPwd">Password</label>
                                    <span className={adminPwd.class}>
                                        <input type="text" name="adminPwd" id="adminPwd" value={adminPwd.pwd} onChange={(e) => setAdminPwd(prev => ({...prev, pwd:e.target.value}))} />
                                        <span className="ipt_hint_msg">Min 8 lowercase, UPPERCASE, numbers & special characters</span>
                                    </span>
                                </p>
                                <p className={btnClass}><button className="btn_blue">Update</button></p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default EditAdmin