import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'

function OptionColumn(props) {

    useEffect(() => {
        props.FN_apiGetOptions()
    }, [])


    // delete option
    async function FN_apiDeleteOption(optID) {
        if (confirm('Are you sure you want to delete this option?')) {
            props.setOptions(prev => ({...prev, loading:true}))
            await axios.post(props.apiURL, {func: 'Delete Option', optID: optID})
                .then(() => {
                    toast.success('Option deleted')
                    props.FN_apiGetOptions()
                })
                .catch(err => toast.error('Option could not be deleted: ' + err))
                .finally(props.setOptions(prev => ({...prev, loading:false})))
        }
    }


    // delete option value
    async function FN_apiDeleteValue(valID) {
        if (confirm('Are you sure you want to delete this option value?')) {
            props.setOptions(prev => ({...prev, loading:true}))
            await axios.post(props.apiURL, {func: 'Delete Option Value', valID: valID})
                .then(() => {
                    toast.success('Option value deleted')
                    props.FN_apiGetOptions()
                })
                .catch(err => toast.error('Option value could not be deleted: ' + err))
                .finally(props.setOptions(prev => ({...prev, loading:false})))
        }
    }

    return (
        <section id="options">
            <div className="column_ttl column_ttl_dark">Item options</div>
            <div className="column_content">
                { props.options.loading ? (
                    <div className="loading">
                        <BeatLoader color="#65A0C1"/>
                    </div>
                ) : (
                    props.options.error ? (
                        <div class="error">
                            <span>Error: { props.options.errorMsg }</span>
                        </div>
                    ) : (
                        <>
                            <div className="column_opts align_right">
                                <Link to="/option/add" className="nav_green">Add option</Link>
                            </div>
                            <div className="column_list">
                                <ul>
                                    { props.options.options && props.options.options.map((option, index) => (
                                        <li key={index}>
                                            { option.type === 'opt' ? (
                                                <span className="opt_parent">
                                                    <span>{ option.ovName }</span>
                                                    <span className="column_li_opts">
                                                        <Link to={`/option/edit/${option.ovID}`} className="nav_grey">Edit</Link>
                                                        { option.canDelete ? (
                                                            <span>
                                                                <a onClick={() => FN_apiDeleteOption(option.ovID)} className="nav_red">Delete</a>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <span className="red_disabled">Delete</span>
                                                            </span>
                                                        )}
                                                        <Link to={`/option/value/add/${option.ovID}`} className="nav_green">Add value</Link>
                                                    </span>
                                                </span>
                                            ) : (
                                                <span>
                                                    <span>&raquo; { option.ovName }</span>
                                                    <span className="column_li_opts">
                                                        <Link to={`/option/value/edit/${option.ovID}`} className="nav_grey">Edit</Link>
                                                        <a onClick={() => FN_apiDeleteValue(option.ovID)} className="nav_red">Delete</a>
                                                    </span>
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )
                )}
            </div>
        </section>
    )
}
export default OptionColumn