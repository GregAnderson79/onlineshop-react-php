import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function PayPal(props) {

    // navigate
    const navigate = useNavigate()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [payPal, setPayPal] = useState({
        email: '',
        class: ''
    })
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [btnClass, setBtnClass] = useState("btn_locked")


    // validate
    useEffect(() => {
        if (payPal.email.length > 0 && !emailRegex.test(payPal.email)) {
            setPayPal(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setPayPal(prev => ({...prev, class:''}))
        }

        if (emailRegex.test(payPal.email)) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }

    }, [payPal.email])


    // API get data
    useEffect(() => {
        async function FN_apiGetPayPal() {
            setFormLoading(true)
            await axios.post(props.apiURL, {func: 'Get PayPal'})
                .then(results => setPayPal(prev => ({...prev, email:results.data.payPalEmail})))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setFormLoading(false))
        }
        FN_apiGetPayPal()
    }, [])


    // API update PayPal email
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Update PayPal', payPalEmail: payPal.email})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'updated') {
            toast.success('PayPal email address updated')
            return navigate('/')
        } else if (result === 'error email') {
            toast.error('PayPal email address must use the name@domain.com format')
        } else {
            toast.error('PayPal email address could not be updated')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">PayPal email</div>
                <div className="popup_pad popup_pnl_v1">
                    { formLoading && (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    )}
                    <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                        <form onSubmit={FN_apiSubmit}>
                            <p>
                                <label htmlFor="payPal">PayPal email</label>
                                <span className={payPal.class}>
                                    <input type="text" name="payPal" id="payPal" value={payPal.email} onChange={(e) => setPayPal(prev => ({...prev, email:e.target.value}))} />
                                    <span className="ipt_hint_msg">name@domain.com</span>
                                </span>
                            </p>
                            <p className={btnClass}><button className="btn_blue">Update</button></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>  
    )
}
export default PayPal