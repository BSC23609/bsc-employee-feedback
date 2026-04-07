const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Updated with your NEW Microsoft Azure IDs
const TENANT_ID = 'f3f819ba-724b-4c0b-a9c0-2aa8d12bcbcc';
const CLIENT_ID = '3283d530-a5a3-44a0-a43a-573e2218bb06';

// The secret is securely injected by Render
const CLIENT_SECRET = process.env.CLIENT_SECRET; 
const USER_EMAIL = 'preethi@bharatsteels.in';

async function getAccessToken() {
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials'
    });

    const response = await axios.post(tokenUrl, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
}

app.post('/api/feedback', async (req, res) => {
    try {
        const feedbackData = req.body;
        const token = await getAccessToken();

        const fileName = `${feedbackData.id}.json`;
        const uploadUrl = `https://graph.microsoft.com/v1.0/users/${USER_EMAIL}/drive/root:/EMPLOYEE FEEDBACK FORM/INDIVIDUAL REPORT/${fileName}:/content`;

        await axios.put(uploadUrl, JSON.stringify(feedbackData, null, 2), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`Successfully uploaded ${fileName} to OneDrive!`);
        res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error("Error uploading to OneDrive:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to upload to OneDrive' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BSC Feedback Backend running on port ${PORT}`));
