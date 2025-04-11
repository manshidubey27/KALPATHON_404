import React, { useState } from "react";
import { supabase } from "./supabaseClient.js";
import './App.css';
import translate from "translate"; // Import the package

translate.engine = "google"; // Choose the translation engine
// Optional: Set your API key if required by the engine
// translate.key = "YOUR_API_KEY";

const App = () => {
    const [filters, setFilters] = useState({
        scheme: "",
        income: "",
        education: "",
        region: "",
        organization: "",
        language: "en", // Default language
    });
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let query = supabase.from("schemes").select("*");

            // Apply filters dynamically
            if (filters.scheme) {
                query = query.ilike("scheme", `%${filters.scheme}%`);
            }
            if (filters.income) {
                query = query.lte("income", parseInt(filters.income,10));
            }
            if (filters.education) {
                query = query.ilike("education", `%${filters.education}%`);
            }
            if (filters.region) {
                query = query.ilike("region", `%${filters.region}%`);
            }
            if (filters.organization) {
                query = query.ilike("organization", `%${filters.organization}%`);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Translate schemes into the selected language
            const translatedSchemes = await Promise.all(
                data.map(async (scheme) => {
                    const translatedName = await translate(
                        scheme.scheme,
                        filters.language
                    );
                    const translatedDescription = await translate(
                        scheme.description,
                        filters.language
                    );
                    return {
                        ...scheme,
                        scheme: translatedName,
                        description: translatedDescription,
                    };
                })
            );

            setSchemes(translatedSchemes);
        } catch (error) {
            console.error("Error fetching schemes:", error.message);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <h1 className="title">Search Government Schemes</h1>
            <div className="filters">
                <input
                    type="text"
                    name="scheme"
                    placeholder="Scheme Name"
                    value={filters.scheme}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="text"
                    name="income"
                    placeholder="Income Level"
                    value={filters.income}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="text"
                    name="education"
                    placeholder="Education Level"
                    value={filters.education}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="text"
                    name="region"
                    placeholder="Region"
                    value={filters.region}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <input
                    type="text"
                    name="organization"
                    placeholder="Organization"
                    value={filters.organization}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
                <select
                    name="language"
                    value={filters.language}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    {/* Add more language options as needed */}
                </select>
                <button onClick={handleSearch} className="search-button">
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>
            <div className="results">
                {loading ? (
                    <p>Loading schemes...</p>
                ) : schemes.length > 0 ? (
                    schemes.map((scheme) => (
                        <div key={scheme.id} className="scheme-card">
                            <h3>{scheme.scheme}</h3>
                            <p><strong>Income Level:</strong> {scheme.income}</p>
                            <p><strong>Description:</strong> {scheme.description}</p>
                            <p><strong>Region:</strong> {scheme.region}</p>
                            <p><strong>Education:</strong> {scheme.education}</p>
                            <p><strong>Organization:</strong> {scheme.organization}</p>
                            {scheme.link && (
                                <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="scheme-link-button"
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-results">No schemes found</p>
                )}
            </div>
        </div>
    );
};

export default App;
