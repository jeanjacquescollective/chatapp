
import Link from 'next/link';

const AdminPage: React.FC = () => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Admin Page</h1>
            <p className="mb-6">Welcome, Admin! You have access to this page.</p>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link href="/admin/users"
                            className="text-blue-500 hover:underline">Manage Users
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/settings" className="text-blue-500 hover:underline">Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminPage;