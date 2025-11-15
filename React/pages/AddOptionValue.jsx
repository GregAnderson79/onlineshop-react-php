import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function AddOptionValue(props) {

    // navigate
    const navigate = useNavigate()

    // opt ID
    const { optID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [valName, setValName] = useState({
        name: '',
        class: ''
    })
    const [btnClass, setBtnClass] = useState('btn_locked')


    // validation
    // option
    useEffect(() => {
        async function FN_getOption(optID) {
            await axios.post(props.apiURL, {func: 'Get Option', optID: optID})
                .then(result => FN_validateOption(result.data))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setFormLoading(false))
        }
        FN_getOption(optID)
    }, [])

    function FN_validateOption(result) {
        if (typeof result === 'undefined' || result === null) {
            setFormError(true)
            toast.error('Error: Option could not be found')
        }
    }

    // name
    useEffect(() => {
        if (valName.name.length > 0 && valName.name.length < 3) {
            setValName(prev => ({...prev, class:'ipt_hint'}))
        } else {
            setValName(prev => ({...prev, class:''}))
        }

        if (valName.name.length >= 3) {
            setBtnClass('')
        } else {
            setBtnClass('btn_locked')
        }
    }, [valName.name])


    // submit
    async function FN_apiSubmit(e) {
        e.preventDefault()
        setFormLoading(true)
        await axios.post(props.apiURL, {func: 'Add Option Value', valName: valName.name, optID: optID})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'added') {
            toast.success('Option value added')
            props.FN_apiGetOptions()
            return navigate('/')
        } else if (result === 'error name') {
            toast.error('Option value names must have at least 3 characters')
        } else {
            toast.error('Option value could not be added')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Add option value</div>
                <div className="popup_pad popup_pnl_v1">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="valName">Option value name</label>
                                    <span className={valName.class}>
                                        <input type="text" name="valName" id="valName" value={valName.name} onChange={(e) => setValName(prev => ({...prev, name:e.target.value}))} />
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
export default AddOptionValue