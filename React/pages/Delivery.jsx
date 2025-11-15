import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function Delivery(props) {

    // navigate
    const navigate = useNavigate()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [delPrice, setDelPrice] = useState({
        price: '',
        class: ''
    })
    const moneyRegex = /^\d+\.?\d{0,2}?$/;
    const [btnClass, setBtnClass] = useState('btn_locked')


    // price
    useEffect(() => {
        if (delPrice.price.length > 0 && !moneyRegex.test(delPrice.price)) {
            setDelPrice(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setDelPrice(prev => ({...prev, class:''}))
        }

        if (moneyRegex.test(delPrice.price)) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }

    }, [delPrice.price])


    // API get data
    useEffect(() => {
        async function FN_apiGetDelPrice() {
            setFormLoading(true)
            await axios.post(props.apiURL, {func: 'Get Delivery Price'})
                .then(results => setDelPrice(prev => ({...prev, price:results.data.delPrice})))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setFormLoading(false))
        }
        FN_apiGetDelPrice()
    }, [])


    // API update delivery price
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Update Delivery Price', delPrice: delPrice.price})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'updated') {
            toast.success('Delivery price updated')
            return navigate('/')
        } else if (result === 'error money') {
            toast.error('Delivery price must be a number formatted to 2 decimal places (123.45)')
        } else {
            toast.error('Delivery price could not be updated')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Manage delivery price</div>
                <div className="popup_pad popup_pnl_v1">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="delPrice">Delivery Price</label>
                                    <span className={delPrice.class}>
                                        <input type="text" name="delPrice" id="delPrice" value={delPrice.price} onChange={(e) => setDelPrice(prev => ({...prev, price:e.target.value}))} />
                                        <span className="ipt_hint_msg">Number formatted to 2 decimal places (123.45)</span>
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
export default Delivery