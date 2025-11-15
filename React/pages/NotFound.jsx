import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className="popup_bg">
            <div className="popup_pnl">
                <div className="popup_close"><Link to="/">&#10005;</Link></div>
                <div className="popup_ttl">Page not found</div>
                <div className="popup_pad popup_pnl_v1">
                    <Link to="/">Return to Home</Link>
                </div>
            </div>
        </div>
    )
}
export default NotFound