import { Link } from 'react-router-dom'

function ManageColumn() {
    return (
        <section id="manage">
            <div className="column_ttl column_ttl_dark">Management</div>
            <div className="column_list column_list_noHdr">
                <ul>
                    <li><span><Link to="/orders">Manage Orders</Link></span></li>
                    <li><span><Link to="/admins">Manage admin accounts</Link></span></li>
                    <li><span><Link to="/paypal">Manage PayPal email</Link></span></li>
                    <li><span><Link to="/delivery">Manage delivery price</Link></span></li>
                </ul>
            </div>
        </section>
    )
}
export default ManageColumn