import Link from 'next/link'

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Access Denied
                </h2>
                <p className="text-gray-500 mb-6">
                    You don&apos;t have permission to view this page
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}