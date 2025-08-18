import React from 'react';

function HistoryCard({ filename, predictionType, label, score }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  let imageUrl = filename 
    ? `${apiUrl}/image/${filename}` 
    : '/default-cow.png';

    console.log(imageUrl)
  return (
    <div className="card history-card h-100">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={label || 'Cattle image'}
        style={{ objectFit: 'cover', height: '200px', width: '100%' }}
      />
      <div className="card-body d-flex flex-column justify-content-between">
        <h6 className="card-title text-center">{predictionType}</h6>
        <p className="card-text text-center mb-1"><strong>{label}</strong></p>
        {score !== undefined && (
          <p className="card-text text-center text-muted">
            Confidence: {(score * 100).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
}

export default HistoryCard;
