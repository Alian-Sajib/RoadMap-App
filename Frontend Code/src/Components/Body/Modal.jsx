import { useEffect, useState } from "react";
import axios from "axios";
import './Modal.css';
import { Url } from "../../redux/actionTypes";
import { useSelector } from "react-redux";

const Modal = ({ item, onClose }) => {
    const token = useSelector(state => state.token);
    const userEmail = localStorage.getItem('email');

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        loadComments();
    }, [item.id]);

    const loadComments = async () => {
        try {
            const res = await axios.get(`${Url}/product/comments/?item=${item.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(res.data);
        } catch (err) {
            console.error("Could not load comments", err);
        }
    };

    const handleAdd = async () => {
        if (!newComment.trim()) return;

        try {
            await axios.post(`${Url}/product/comments/`, {
                item: item.id,
                text: newComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewComment("");
            loadComments();
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${Url}/product/comments/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadComments();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const handleEdit = async (id) => {
        try {
            await axios.patch(`${Url}/product/comments/${id}/`, { text: editText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            loadComments();
        } catch (err) {
            console.error("Edit failed", err);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <button className="close-btn" onClick={onClose}>×</button>

                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className={`status ${item.status}`}>{item.status}</span>
                <p>Upvotes: {item.upvotes}</p>

                <hr />
                <h3>Comments</h3>

                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment-box">
                            <strong>{comment.user}</strong>

                            {editingId === comment.id ? (
                                <>
                                    <br />
                                    <textarea
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                    />
                                    <br />
                                    <button onClick={() => handleEdit(comment.id)} style={{ marginRight: 10 }}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </>
                            ) : (
                                <p>{comment.text}</p>
                            )}

                            {userEmail === comment.user && editingId !== comment.id && (
                                <div className="comment-actions">
                                    <button onClick={() => {
                                        setEditingId(comment.id);
                                        setEditText(comment.text);
                                    }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(comment.id)}>Delete</button>
                                </div>
                            )}

                            <hr />
                        </div>
                    ))}
                </div>

                <hr />

                <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <br /><br />
                <button onClick={handleAdd}>Post Comment</button>
            </div>
        </div>
    );
};

export default Modal;
