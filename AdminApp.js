// AdminApp.js (Main Component for Admin Dashboard)
import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './AdminApp.css'; // Admin-specific styles

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [ipos, setIpos] = useState([]); // Manage IPOs in admin

    useEffect(() => {
        // In a real app, check localStorage for a token or session
        const storedAuth = localStorage.getItem('adminAuth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        // Fetch IPOs for admin view
        // In a real app, this would be an authenticated API call
        const dummyAdminData = [
            {
                id: 1,
                companyName: 'Tech Innovators Ltd.',
                openDate: '2025-07-01',
                closeDate: '2025-07-05',
                priceBand: '₹100-110',
                lotSize: 120,
                sector: 'Technology',
                description: 'Leading software development company.',
                rhpLink: 'https://example.com/rhp/tech.pdf',
            },
            {
                id: 2,
                companyName: 'Green Energy Solutions',
                openDate: '2025-06-25',
                closeDate: '2025-06-29',
                priceBand: '₹50-55',
                lotSize: 250,
                sector: 'Renewable Energy',
                description: 'Pioneering in solar and wind energy.',
                rhpLink: 'https://example.com/rhp/green.pdf',
            },
        ];
        setIpos(dummyAdminData);
    }, []);

    const handleLogin = (username, password) => {
        // Basic static validation
        if (username === 'admin' && password === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true'); // Simulate session
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
    };

    const addIpo = (newIpo) => {
        // In a real app, send to backend and then update state
        const id = ipos.length > 0 ? Math.max(...ipos.map(ipo => ipo.id)) + 1 : 1;
        setIpos([...ipos, { ...newIpo, id }]);
        console.log('IPO Added:', { ...newIpo, id });
    };

    const updateIpo = (updatedIpo) => {
        // In a real app, send to backend and then update state
        setIpos(ipos.map(ipo => (ipo.id === updatedIpo.id ? updatedIpo : ipo)));
        console.log('IPO Updated:', updatedIpo);
    };

    const deleteIpo = (id) => {
        // In a real app, send to backend and then update state
        if (window.confirm('Are you sure you want to delete this IPO?')) {
            setIpos(ipos.filter(ipo => ipo.id !== id));
            console.log('IPO Deleted:', id);
        }
    };


    return (
        <div className="AdminApp">
            {isAuthenticated ? (
                <AdminDashboard
                    ipos={ipos}
                    onLogout={handleLogout}
                    onAddIpo={addIpo}
                    onUpdateIpo={updateIpo}
                    onDeleteIpo={deleteIpo}
                />
            ) : (
                <AdminLogin onLogin={handleLogin} />
            )}
        </div>
    );
}

export default AdminApp;

// components/AdminLogin.js
import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        if (onLogin(username, password)) {
            // Login successful, parent component handles redirection
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleSubmit} className="admin-login-form">
                <h2>Admin Login</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;


// components/AdminDashboard.js
import React, { useState } from 'react';
import IPOForm from './IPOForm';
import './AdminDashboard.css';

function AdminDashboard({ ipos, onLogout, onAddIpo, onUpdateIpo, onDeleteIpo }) {
    const [editingIpo, setEditingIpo] = useState(null); // IPO being edited
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const handleEdit = (ipo) => {
        setEditingIpo(ipo);
        setMessage(''); // Clear messages when starting edit
    };

    const handleDelete = (id) => {
        onDeleteIpo(id);
        setMessage('IPO deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleFormSubmit = (ipoData) => {
        if (editingIpo) {
            onUpdateIpo(ipoData);
            setMessage('IPO updated successfully!');
            setMessageType('success');
        } else {
            onAddIpo(ipoData);
            setMessage('IPO added successfully!');
            setMessageType('success');
        }
        setEditingIpo(null); // Exit edit mode
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    const handleCancelEdit = () => {
        setEditingIpo(null);
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>IPO Admin Dashboard</h1>
                <button onClick={onLogout} className="logout-button">Logout</button>
            </header>

            <main className="admin-main">
                {message && <div className={`alert ${messageType}`}>{message}</div>}

                <button onClick={() => setEditingIpo({})} className="add-new-button">
                    Add New IPO
                </button>

                {editingIpo && (
                    <IPOForm
                        ipoToEdit={editingIpo}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelEdit}
                    />
                )}

                <h2 className="section-title">Manage IPOs</h2>
                <div className="ipo-table-container">
                    <table className="ipo-table">
                        <thead>
                            <tr>
                                <th>Company Name</th>
                                <th>Open Date</th>
                                <th>Close Date</th>
                                <th>Price Band</th>
                                <th>Lot Size</th>
                                <th>Sector</th>
                                <th>RHP Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ipos.map((ipo) => (
                                <tr key={ipo.id}>
                                    <td>{ipo.companyName}</td>
                                    <td>{ipo.openDate}</td>
                                    <td>{ipo.closeDate}</td>
                                    <td>{ipo.priceBand}</td>
                                    <td>{ipo.lotSize}</td>
                                    <td>{ipo.sector}</td>
                                    <td>
                                        {ipo.rhpLink && (
                                            <a href={ipo.rhpLink} target="_blank" rel="noopener noreferrer">
                                                Link
                                            </a>
                                        )}
                                    </td>
                                    <td className="actions-column">
                                        <button onClick={() => handleEdit(ipo)} className="action-button edit">Edit</button>
                                        <button onClick={() => handleDelete(ipo.id)} className="action-button delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;


// components/IPOForm.js
import React, { useState, useEffect } from 'react';
import './IPOForm.css';

function IPOForm({ ipoToEdit, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        companyName: '',
        openDate: '',
        closeDate: '',
        priceBand: '',
        lotSize: '',
        sector: '',
        description: '',
        rhpLink: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (ipoToEdit && Object.keys(ipoToEdit).length > 0) { // Check if it's an actual IPO object
            setFormData(ipoToEdit);
        } else {
            // Reset form for "Add New"
            setFormData({
                companyName: '',
                openDate: '',
                closeDate: '',
                priceBand: '',
                lotSize: '',
                sector: '',
                description: '',
                rhpLink: '',
            });
        }
    }, [ipoToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for the field being edited
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.companyName) newErrors.companyName = 'Company Name is required.';
        if (!formData.openDate) newErrors.openDate = 'Open Date is required.';
        if (!formData.closeDate) newErrors.closeDate = 'Close Date is required.';
        if (!formData.priceBand) newErrors.priceBand = 'Price Band is required.';
        if (!formData.lotSize || isNaN(formData.lotSize)) newErrors.lotSize = 'Lot Size must be a number.';
        if (!formData.sector) newErrors.sector = 'Sector is required.';
        if (!formData.description) newErrors.description = 'Description is required.';
        // Basic RHP link validation (optional, can be more robust)
        if (formData.rhpLink && !/^https?:\/\/.+\.pdf$/i.test(formData.rhpLink)) {
            newErrors.rhpLink = 'RHP Link must be a valid PDF URL.';
        }

        // Date validation (open date before close date)
        if (formData.openDate && formData.closeDate && new Date(formData.openDate) > new Date(formData.closeDate)) {
            newErrors.closeDate = 'Close Date cannot be before Open Date.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            // Form will be cleared by useEffect due to ipoToEdit becoming null
        } else {
            console.log("Form has errors:", errors);
        }
    };

    return (
        <div className="ipo-form-container">
            <h3>{ipoToEdit && Object.keys(ipoToEdit).length > 0 ? 'Edit IPO' : 'Add New IPO'}</h3>
            <form onSubmit={handleSubmit} className="ipo-form">
                <div className="form-group">
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={errors.companyName ? 'input-error' : ''}
                    />
                    {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="openDate">Open Date:</label>
                    <input
                        type="date"
                        id="openDate"
                        name="openDate"
                        value={formData.openDate}
                        onChange={handleChange}
                        className={errors.openDate ? 'input-error' : ''}
                    />
                    {errors.openDate && <span className="error-text">{errors.openDate}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="closeDate">Close Date:</label>
                    <input
                        type="date"
                        id="closeDate"
                        name="closeDate"
                        value={formData.closeDate}
                        onChange={handleChange}
                        className={errors.closeDate ? 'input-error' : ''}
                    />
                    {errors.closeDate && <span className="error-text">{errors.closeDate}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="priceBand">Price Band:</label>
                    <input
                        type="text"
                        id="priceBand"
                        name="priceBand"
                        value={formData.priceBand}
                        onChange={handleChange}
                        placeholder="e.g., ₹100-110"
                        className={errors.priceBand ? 'input-error' : ''}
                    />
                    {errors.priceBand && <span className="error-text">{errors.priceBand}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="lotSize">Lot Size:</label>
                    <input
                        type="number"
                        id="lotSize"
                        name="lotSize"
                        value={formData.lotSize}
                        onChange={handleChange}
                        className={errors.lotSize ? 'input-error' : ''}
                    />
                    {errors.lotSize && <span className="error-text">{errors.lotSize}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="sector">Sector:</label>
                    <input
                        type="text"
                        id="sector"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        className={errors.sector ? 'input-error' : ''}
                    />
                    {errors.sector && <span className="error-text">{errors.sector}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={errors.description ? 'input-error' : ''}
                    ></textarea>
                    {errors.description && <span className="error-text">{errors.description}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="rhpLink">RHP Link (PDF URL):</label>
                    <input
                        type="url"
                        id="rhpLink"
                        name="rhpLink"
                        value={formData.rhpLink}
                        onChange={handleChange}
                        placeholder="https://example.com/document.pdf"
                        className={errors.rhpLink ? 'input-error' : ''}
                    />
                    {errors.rhpLink && <span className="error-text">{errors.rhpLink}</span>}
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        {ipoToEdit && Object.keys(ipoToEdit).length > 0 ? 'Update IPO' : 'Add IPO'}
                    </button>
                    <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default IPOForm;