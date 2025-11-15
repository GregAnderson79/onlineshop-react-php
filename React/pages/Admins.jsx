import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import axios from 'axios'
import { toast } from 'react-toastify'

function Admins(props) {

    // state
    const [admins, setAdmins] = useState({
        data: '',
        loading: false,
        error: false
    })

    // API get admins
    async function FN_apiGetAdmins() {
        setAdmins(prev => ({...prev, loading:true}))
            await axios.post(props.apiURL, {func: 'Get Admins'})
                .then(results => setAdmins(prev => ({...prev, data:results.data})))
                .catch(err => setAdmins({error:true, errorMsg:err}))
                .finally(setAdmins(prev => ({...prev, loading:false})))
    }

    useEffect(() => {
        FN_apiGetAdmins()
    }, [])


    // API delete admin
    async function FN_apiDeleteAdmin(adminID) {
        if (confirm('Are you sure you want to delete this admin')) {
            await axios.post(props.apiURL, {func: 'Delete Admin', adminID: adminID})
                .then(() => {
                    toast.success('Admin deleted')
                    FN_apiGetAdmins()
                })
                .catch(err => toast.error('Admin could not be deleted: ' + err))
        }
    }

    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Manage admin accounts</div>
                <div className="popup_pad popup_pnl_v2">
                    { admins.loading && (
                        <div className="loading">
                            <BeatLoader color="#65A0C1"/>
                        </div>
                    )}
                    { admins.error ? (
                        <div className="error">
                            <span>Error: { admins.errorMsg }</span>
                        </div>
                    ) : (
                        <div className="popup_list">
                            <div className="popup_list_hdr">
                                <Link to="/admin/add" className="nav_green">Add admin account</Link>
                            </div>
                            <ul>
                                { admins.data && admins.data.map((admin) => (
                                    <li key={ admin.adminID }>
                                        { admin.adminName }
                                        <span className="popup_list_opts">
                                            <Link to={`/admin/edit/${admin.adminID}`} className="nav_grey">Edit</Link>
                                            <a onClick={() => FN_apiDeleteAdmin(admin.adminID)} className="nav_red">Delete</a>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Admins