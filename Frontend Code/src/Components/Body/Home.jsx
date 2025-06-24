import { useEffect, useState } from "react";
import './Home.css';
import axios from "axios";
import { Url } from "../../redux/actionTypes";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import { useNavigate } from "react-router";

const Home = () => {
    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [status, setStatus] = useState("All");
    const [upvoted, setUpvoted] = useState(new Set());
    const [selected, setSelected] = useState(null);

    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        const loadItems = async () => {
            try {
                const res = await axios.get(`${Url}/product/items/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItems(res.data);
                setFiltered(res.data);
            } catch (err) {
                console.error("Failed to fetch items", err);
            }
        };

        loadItems();
    }, [token]);

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);

        if (value === "All") {
            setFiltered(items);
        } else {
            setFiltered(items.filter(i => i.status === value));
        }
    };

    const sortByUpvotes = () => {
        const sorted = [...filtered].sort((a, b) => b.upvotes - a.upvotes);
        setFiltered(sorted);
    };

    const handleUpvote = async (id) => {
        try {
            const res = await axios.post(`${Url}/product/upvote/${id}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // toggle local upvote state
            const updatedList = filtered.map(i =>
                i.id === id ? { ...i, upvotes: res.data.upvotes } : i
            );
            setFiltered(updatedList);

            const updatedSet = new Set(upvoted);
            if (updatedSet.has(id)) {
                updatedSet.delete(id);
            } else {
                updatedSet.add(id);
            }
            setUpvoted(updatedSet);
        } catch (err) {
            console.error("Upvote error:", err);
        }
    };

    return (
        <div className="feedback-wrapper">
            <h2>Apple Product Feedback</h2>

            <div className="filter-bar">
                <select value={status} onChange={handleStatusChange} className="dropdown">
                    <option value="All">All Status</option>
                    <option value="1">In Progress</option>
                    <option value="2">In Review</option>
                    <option value="3">Completed</option>
                </select>

                <button className="sort-button" onClick={sortByUpvotes}>Sort by Upvotes</button>
                <button className="logout-button" onClick={() => navigate('/logout')}>Logout</button>
            </div>

            <div className="scroll-box">
                {filtered.map(item => (
                    <div key={item.id} className="feedback-card">
                        <div
                            className={`upvote clickable ${upvoted.has(item.id) ? 'active' : ''}`}
                            onClick={() => handleUpvote(item.id)}
                            title="Upvote"
                        >
                            {item.upvotes} ▲
                        </div>
                        <div className="feedback-content">
                            <h3
                                onClick={() => setSelected(item)}
                                style={{ cursor: 'pointer', color: '#4661e6' }}
                            >
                                {item.title}
                            </h3>
                            <p>{item.description}</p>
                            <span className={`status ${item.status.replace(/\s+/g, '-')}`}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}

                {selected && (
                    <Modal item={selected} onClose={() => setSelected(null)} />
                )}
            </div>
        </div>
    );
};

export default Home;