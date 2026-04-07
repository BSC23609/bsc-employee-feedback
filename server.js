const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// CRITICAL: Increased limit to 50mb to allow PDF file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Your Microsoft Azure IDs
const TENANT_ID = 'f3f819ba-724b-4c0b-a9c0-2aa8d12bcbcc';
const CLIENT_ID = '3283d530-a5a3-44a0-a43a-573e2218bb06';
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
        // Now receiving both the raw data AND the base64 PDF string
        const { data, pdfBase64 } = req.body;
        const token = await getAccessToken();

        // 1. UPLOAD PDF TO INDIVIDUAL REPORTS FOLDER
        if (pdfBase64) {
            const fileName = `${data.id}.pdf`;
            const pdfUploadUrl = `https://graph.microsoft.com/v1.0/users/${USER_EMAIL}/drive/root:/EMPLOYEE FEEDBACK FORM/INDIVIDUAL REPORT/${fileName}:/content`;
            
            // Convert the base64 string back into a real PDF file
            const pdfBuffer = Buffer.from(pdfBase64, 'base64');

            await axios.put(pdfUploadUrl, pdfBuffer, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/pdf'
                }
            });
            console.log(`Successfully uploaded PDF: ${fileName}`);
        }

        // 2. APPEND TO CONSOLIDATED EXCEL FILE
        const excelFileName = 'BSC_Feedback_Template.xlsx';
        const tableName = 'Table1';
        const excelUrl = `https://graph.microsoft.com/v1.0/users/${USER_EMAIL}/drive/root:/EMPLOYEE FEEDBACK FORM/CONSOLIDATED/${excelFileName}:/workbook/tables/${tableName}/rows`;

        const timeString = new Date().toLocaleTimeString('en-IN');
        
        // This MUST match your 42 Excel columns perfectly
        const excelRow = [[
            "", // S.N
            data.id || "",
            data.date || "",
            timeString,
            data.name || "",
            data.empId || "",
            data.email || "",
            data.phone || "",
            data.department || "",
            data.gender || "",
            data.tenure || "",
            data.role || "",
            data.anonymous ? "Yes" : "No",
            data.ratings.q_workspace || "",
            data.ratings.q_tools || "",
            data.ratings.q_safety || "",
            data.ratings.q_workhours || "",
            data.ratings.q_facilities || "",
            data.ratings.q_mgmt_comm || "",
            data.ratings.q_mgmt_open || "",
            data.ratings.q_mgmt_fair || "",
            data.ratings.q_mgmt_feedback || "",
            data.ratings.q_mgmt_timely || "",
            data.ratings.q_salary || "",
            data.ratings.q_hike || "",
            data.ratings.q_training || "",
            data.ratings.q_growth || "",
            data.ratings.q_culture || "",
            data.ratings.q_leave || "",
            data.ratings.q_gender_respect || "",
            data.ratings.q_bonding || "",
            data.ratings.q_overall || "",
            data.ratings.q_enps || "",
            (data.benefits || []).join(', '),
            data.leaveDays || "",
            data.textResponses.q_env_suggestions || "",
            data.textResponses.q_mgmt_suggestions || "",
            data.textResponses.q_comp_suggestions || "",
            data.textResponses.q_culture_suggestions || "",
            data.textResponses.q_one_change || "",
            data.textResponses.q_doing_well || "",
            data.textResponses.q_final_comments || ""
        ]];

        await axios.post(excelUrl, { values: excelRow }, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        console.log("Appended to Excel successfully!");

        res.status(200).json({ message: 'Success' });

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to upload data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BSC Feedback Backend running on port ${PORT}`));
