import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssetById } from '../services/api';

const AssetDetails = () => {
  const { assetId } = useParams();
  const navigate = useNavigate(); // ✅ Step 1
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await getAssetById(assetId);
        setAsset(data);
      } catch (err) {
        setError('Error fetching asset details');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [assetId]);

  const handleReportIssue = () => {
    navigate(`/report-issue/${assetId}`); // ✅ Step 2: Redirect to issue report page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Asset Details</h2>
      {asset ? (
        <div>
          <p>Name: {asset.name}</p>
          <p>Description: {asset.description}</p>
          <img src={asset.qrCode} alt="QR Code" />

          {/* ✅ Step 3: Add Report Issue Button */}
          <button
  onClick={handleReportIssue}
  style={{
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  }}
  onMouseOver={(e) => (e.target.style.backgroundColor = '#d9363e')}
  onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d4f')}
>
  Report Issue
</button>

        </div>
      ) : (
        <p>Asset not found</p>
      )}
    </div>
  );
};

export default AssetDetails;
