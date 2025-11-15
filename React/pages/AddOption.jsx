import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function AddOption(props) {

    // navigate
    const navigate = useNavigate()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [optName, setOptName] = useState({
        name: '',
        class: ''
    })
    const [btnClass, setBtnClass] = useState('btn_locked')

    // validation
    useEffect(() => {
        if (optName.name.length > 0 && optName.name.length < 3) {
            setOptName(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setOptName(prev => ({...prev, class:''}))
        }

        if (optName.name.length >= 3) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }, [optName.name])

    // submit
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Add Option', optName: optName.name})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'added') {
            toast.success('Option added')
            props.FN_apiGetOptions()
            return navigate('/')
        } else if (result === 'error name') {
            toast.error('Option names must have at least 3 characters')
        } else {
            toast.error('Option could not be added')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Add option</div>
                <div className="popup_pad popup_pnl_v1">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className="popup_form">
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="optName">Option name</label>
                                    <span className={optName.class}>
                                        <input type="text" name="optName" id="optName" value={optName.name} onChange={(e) => setOptName(prev => ({...prev, name:e.target.value}))} />
                                        <span className="ipt_hint_msg">Minimum 3 characters</span>
                                    </span>
                                </p>
                                <p className={btnClass}><button className="btn_blue">Submit</button></p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default AddOption