// App.js (Main Component)
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IPOList from './components/IPOList';
import IPODetail from './components/IPODetail';
import Footer from './components/Footer';
import './App.css'; // Global styles

function App() {
    const [ipos, setIpos] = useState([]); // State to hold all IPO data
    const [filteredIpos, setFilteredIpos] = useState([]); // State for filtered/searched IPOs
    const [selectedIpo, setSelectedIpo] = useState(null); // For detailed view
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(''); // e.g., 'upcoming', 'past', 'all'
    const [filterSector, setFilterSector] = useState('');

    useEffect(() => {
        // In a real application, fetch this from a backend API
        const dummyData = [
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
            {
                id: 3,
                companyName: 'Pharma Giants Inc.',
                openDate: '2025-07-10',
                closeDate: '2025-07-14',
                priceBand: '₹200-220',
                lotSize: 60,
                sector: 'Pharmaceuticals',
                description: 'Developing cutting-edge medicines.',
                rhpLink: 'https://example.com/rhp/pharma.pdf',
            },
             {
                id: 4,
                companyName: 'Global Manufacturing Co.',
                openDate: '2025-06-15',
                closeDate: '2025-06-19', // Past IPO
                priceBand: '₹80-90',
                lotSize: 150,
                sector: 'Manufacturing',
                description: 'Diversified manufacturing conglomerate.',
                rhpLink: 'https://example.com/rhp/global.pdf',
            },
            // ... more IPOs
        ];
        setIpos(dummyData);
        setFilteredIpos(dummyData); // Initially show all
    }, []);

    useEffect(() => {
        let currentIpos = [...ipos];

        // Apply search
        if (searchTerm) {
            currentIpos = currentIpos.filter(ipo =>
                ipo.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filter
        const today = new Date();
        currentIpos = currentIpos.filter(ipo => {
            const open = new Date(ipo.openDate);
            const close = new Date(ipo.closeDate);

            if (filterDate === 'upcoming') {
                return open > today;
            } else if (filterDate === 'open_now') {
                return open <= today && close >= today;
            } else if (filterDate === 'closed') {
                return close < today;
            }
            return true; // 'all' or no filter
        });

        // Apply sector filter
        if (filterSector && filterSector !== 'All') {
            currentIpos = currentIpos.filter(ipo => ipo.sector === filterSector);
        }

        setFilteredIpos(currentIpos);
    }, [searchTerm, filterDate, filterSector, ipos]);


    const handleViewDetails = (ipo) => {
        setSelectedIpo(ipo);
    };

    const handleBackToList = () => {
        setSelectedIpo(null);
    };

    const uniqueSectors = [...new Set(ipos.map(ipo => ipo.sector))];


    return (
        <div className="App">
            <Header />
            <main className="container">
                {selectedIpo ? (
                    <IPODetail ipo={selectedIpo} onBack={handleBackToList} />
                ) : (
                    <>
                        <div className="filters-search-container">
                            <input
                                type="text"
                                placeholder="Search by company name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <select
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Dates</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="open_now">Open Now</option>
                                <option value="closed">Closed</option>
                            </select>
                            <select
                                value={filterSector}
                                onChange={(e) => setFilterSector(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Sectors</option>
                                {uniqueSectors.map(sector => (
                                    <option key={sector} value={sector}>{sector}</option>
                                ))}
                            </select>
                        </div>
                        <IPOList ipos={filteredIpos} onViewDetails={handleViewDetails} />
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;

// components/Header.js
import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <nav className="navbar">
                <a href="/" className="logo">IPO Tracker</a>
                <ul className="nav-links">
                    <li><a href="/">Upcoming IPOs</a></li>
                    <li><a href="/about">About Us</a></li>
                    {/* Add a link for admin if desired, but ideally separate login */}
                </ul>
            </nav>
        </header>
    );
}

export default Header;


// components/IPOList.js
import React from 'react';
import './IPOList.css';

function IPOList({ ipos, onViewDetails }) {
    if (ipos.length === 0) {
        return <p className="no-ipos-message">No IPOs found matching your criteria.</p>;
    }

    return (
        <div className="ipo-list">
            {ipos.map((ipo) => (
                <div key={ipo.id} className="ipo-card">
                    <h3 className="company-name">{ipo.companyName}</h3>
                    <p><strong>Open:</strong> {ipo.openDate}</p>
                    <p><strong>Close:</strong> {ipo.closeDate}</p>
                    <p><strong>Price Band:</strong> {ipo.priceBand}</p>
                    <p><strong>Lot Size:</strong> {ipo.lotSize}</p>
                    <p><strong>Sector:</strong> {ipo.sector}</p>
                    <div className="card-actions">
                        <button onClick={() => onViewDetails(ipo)} className="details-button">View Details</button>
                        <a href="https://example.com/apply" target="_blank" rel="noopener noreferrer" className="apply-button">Apply Now</a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IPOList;


// components/IPODetail.js
import React from 'react';
import './IPODetail.css';

function IPODetail({ ipo, onBack }) {
    if (!ipo) return null;

    return (
        <div className="ipo-detail-container">
            <button onClick={onBack} className="back-button">&larr; Back to List</button>
            <div className="ipo-detail-card">
                <h2>{ipo.companyName}</h2>
                <p><strong>Open Date:</strong> {ipo.openDate}</p>
                <p><strong>Close Date:</strong> {ipo.closeDate}</p>
                <p><strong>Price Band:</strong> {ipo.priceBand}</p>
                <p><strong>Lot Size:</strong> {ipo.lotSize}</p>
                <p><strong>Sector:</strong> {ipo.sector}</p>
                <p><strong>Description:</strong> {ipo.description}</p>
                {ipo.rhpLink && (
                    <p>
                        <strong>RHP Link:</strong>{' '}
                        <a href={ipo.rhpLink} target="_blank" rel="noopener noreferrer" className="rhp-link">
                            Download RHP
                        </a>
                    </p>
                )}
                <a href="https://example.com/apply" target="_blank" rel="noopener noreferrer" className="apply-now-btn-detail">Apply Now</a>
            </div>
        </div>
    );
}

export default IPODetail;


// components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} IPO Tracker. All rights reserved.</p>
            <div className="social-links">
                <a href="#" className="social-icon">FB</a>
                <a href="#" className="social-icon">TW</a>
                <a href="#" className="social-icon">LI</a>
            </div>
        </footer>
    );
}

export default Footer;