import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../redux/user/userSlice'

function Header() {

    const dispatch = useDispatch()
    const savedUser = useSelector((state => state.user.currentUser))
    const savedUserName = savedUser.adminName
    const savedUserInitials = savedUser.adminName.match(/(^\S\S?|\s\S)?/g).map(v=>v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()

    function FN_adminLogout() {
        if (confirm('Are you sure you want to logout?')) {
            toast.success('Logged out')
            dispatch(adminLogout())
        }
    }

    return (
        <>
            <header>
                <div className="hdr_title"><Link to="/">Shop Admin</Link></div>
                <div className="hdr_name">{ savedUserName }</div>
                <div className="hdr_initials">{ savedUserInitials }</div>
                <a onClick={() => FN_adminLogout()} className="nav_blue">Logout</a>
            </header>
        </>
    )
}
export default Header