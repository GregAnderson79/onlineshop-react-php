import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function EditOption(props) {

    // navigate
    const navigate = useNavigate()

    // opt ID
    const { optID } = useParams()

    // form state
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState(false)
    const [optName, setOptName] = useState({
        name: '',
        class: ''
    })
    const [btnClass, setBtnClass] = useState('btn_locked')


    // get option data
    useEffect(() => {
        async function FN_apiGetOptData() {
            setFormLoading(true)
            await axios.post(props.apiURL, {func: 'Get Option', optID: optID})
                .then(results => FN_useOptData(results.data))
                .catch(err => {
                    setFormError(true)
                    toast.error('Error: ' + err)
                })
                .finally(setFormLoading(false))
        }
        FN_apiGetOptData()
    }, [])

    // use option data
    function FN_useOptData(data) {
        if (typeof data === 'undefined' || data === null) {
            setFormError(true)
            toast.error('Option could not be found')
        } else {
            setOptName(prev => ({...prev, name:data.optName}))
        }
    }


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
        await axios.post(props.apiURL, {func: 'Update Option', optName: optName.name, optID: optID})
            .then(result => FN_submitResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setFormLoading(false))
    }

    // handle api response
    function FN_submitResponse(result) {
        if (result === 'updated') {
            toast.success('Option updated')
            props.FN_apiGetOptions()
            return navigate('/')
        } else if (result === 'error name') {
            toast.error('Option names must have at least 3 characters')
        } else {
            toast.error('Option could not be updated')
        }
        console.log(result)
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Edit option</div>
                <div className="popup_pad popup_pnl_v1">
                    { formLoading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        <div className={formError ? 'popup_form popup_error' : 'popup_form'}>
                            <form onSubmit={FN_apiSubmit}>
                                <p>
                                    <label htmlFor="optName">Option name</label>
                                    <span className={optName.class}>
                                        <input type="text" name="optName" id="optName" value={optName.name} onChange={(e) => setOptName(prev => ({...prev, name:e.target.value}))} />
                                        <span className="ipt_hint_msg">Minimum 3 characters</span>
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
export default EditOption