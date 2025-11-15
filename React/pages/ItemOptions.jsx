import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'

function ItemOptions(props) {

    // item ID
    const { itemID } = useParams()

    // API get options
    const [options, setOptions] = useState({
        options: '',
        loading: false,
        error: false,
        errorMsg: ''
    })

    async function FN_apiGetOptions() {
        setOptions(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Get Options Assoc', itemID: itemID})
            .then(results => setOptions(prev => ({...prev, options:results.data})))
            .catch(err => setOptions({error:true, errorMsg:err}))
            .finally(setOptions(prev => ({...prev, loading:false})))
    }

    useEffect(() => {
        FN_apiGetOptions()
    }, [])


    // add option assoc
    async function FN_apiAddOption(optID) {
        setOptions(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Add Option Assoc', optID: optID, itemID: itemID})
            .then(result => FN_addOptResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setOptions(prev => ({...prev, loading:false})))
    }

    function FN_addOptResponse(result) {
        if (result === 'added') {
            FN_apiGetOptions()
        } else {
            toast.error('Error: Option association could not be created')
        }
    }


    // remove option assoc
    async function FN_apiRemoveOption(optID) {
        setOptions(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Remove Option Assoc', optID: optID, itemID: itemID})
            .then(result => FN_removeOptResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setOptions(prev => ({...prev, loading:false})))
    }

    function FN_removeOptResponse(result) {
        if (result === 'removed') {
            FN_apiGetOptions()
        } else {
            toast.error('Error: Option association could not be removed')
        }
    }


    // add option value assoc
    async function FN_apiAddValue(valID) {
        setOptions(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Add Option Value Assoc', valID: valID, itemID: itemID})
            .then(result => FN_addValResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setOptions(prev => ({...prev, loading:false})))
    }

    function FN_addValResponse(result) {
        if (result === 'added') {
            FN_apiGetOptions()
        } else {
            toast.error('Error: Option value association could not be created')
        }
    }


    // remove option value assoc
    async function FN_apiRemoveValue(valID) {
        setOptions(prev => ({...prev, loading:true}))
        await axios.post(props.apiURL, {func: 'Remove Option Value Assoc', valID: valID, itemID: itemID})
            .then(result => FN_removeValResponse(result.data))
            .catch(err => toast.error('Error: ' + err))
            .finally(setOptions(prev => ({...prev, loading:false})))
    }

    function FN_removeValResponse(result) {
        if (result === 'removed') {
            FN_apiGetOptions()
        } else {
            toast.error('Error: Option value association could not be removed')
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Edit options</div>
                <div className="popup_pad popup_pnl_v3">
                    { options.loading ? (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    ) : (
                        options.error ? (
                            <div className="error">
                                <span>Error: { options.errorMsg }</span>
                            </div>
                        ) : (                    
                            <div className="column_list">
                                <ul>
                                    { options.options && options.options.map((option, index) => (
                                        <li key={ index }>
                                            { option.type === "opt" ? (
                                                <span className="opt_parent">
                                                    <span>{ option.ovName }</span>
                                                    <span className="column_li_opts">
                                                        { (option.isAssoc && option.canRmv) ? (
                                                            <a onClick={() => FN_apiRemoveOption(option.ovID)} className="nav_red">Remove this option</a>
                                                        ) : (
                                                            (option.isAssoc && !option.canRmv) ? (
                                                                <span className="red_disabled">Remove this option</span>
                                                            ) : (
                                                                <a onClick={() => FN_apiAddOption(option.ovID)} className="nav_green">Add this option</a>
                                                            )
                                                        )}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span>
                                                    <span>&raquo; { option.ovName }</span>
                                                    <span className="column_li_opts" v-if="option.isAssoc === true">
                                                        { option.isAssoc ? (
                                                            <a onClick={() => FN_apiRemoveValue(option.ovID)} className="nav_red">Remove this option value</a>
                                                        ) : (
                                                            <a onClick={() => FN_apiAddValue(option.ovID)} className="nav_green">Add this option value</a>
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>      
    )
}
export default ItemOptions