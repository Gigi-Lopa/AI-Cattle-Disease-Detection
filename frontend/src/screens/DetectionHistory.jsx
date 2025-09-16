import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useParams } from 'react-router-dom'; 
import HistoryCard from '../components/history_card';

export default function DetectionHistory() {
    const { user_id } = useParams(); 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let [token, set_token] = useState({username : "", id : ""})

    useEffect(() => {
        let data = localStorage.getItem("token")
        if (data){
        try{
            let parsed_token = JSON.parse(data)
            set_token({
            id : parsed_token?.id,
            username : parsed_token?.username,

            });
        } catch{
            console.log("Error")
        }
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:5000/history/${user_id}`);
                if (!res.ok) throw new Error("Failed to fetch history");
                const json = await res.json();
                setData(json.history || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user_id]);

    return (
        <div className='main-content'>
            <Navbar username={token.username}>
                <Link to={"/Home"} className='nav-link'>Home</Link>
            </Navbar>

            <div className='container'>
                <div className='mt-5'>
                    <h2 className='text-center hd-2 mb-3'>Detection History</h2>

                    <div className='detection-history'>
                        {loading ? (
                            <div className="c-p flex flex-c flex-center">
                                <span className='bi bi-clock-history'></span>
                                <h4 className='text-center'>Loading...</h4>
                            </div>
                        ) : error ? (
                            <div className="c-p flex flex-c flex-center">
                                <h4 className='text-center text-danger'>{error}</h4>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="c-p flex flex-c flex-center">
                                <span className='bi bi-clock-history'></span>
                                <h4 className='text-center'>No history</h4>
                            </div>
                        ) : (
                            <div className='row'>
                                {data.map((item, index) => (
                                    <div key={index} className='col-md-4 mb-3'>
                                        <HistoryCard
                                            filename={item.filename}
                                            predictionType={item.prediction_type}
                                            label={item.label}
                                            score={item.score_or_confidence}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
