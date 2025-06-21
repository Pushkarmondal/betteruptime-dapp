import express from 'express';
import { authMiddleWare } from './middleware';
const app = express();
const PORT = 9008;

app.post('/api/v1/website', authMiddleWare, (req, res) => {
    

})
app.get('/api/v1/website/status', authMiddleWare, (req, res) => {

})

app.get('/api/v1/website', authMiddleWare, (req, res) => {
    
})

app.delete('/api/v1/website/:websiteId', authMiddleWare, (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Website is running on PORT ${PORT}`)
})