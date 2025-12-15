import experss from 'express';
import router from './routers/ai.js' ;
import cors from 'cors';
const app = experss();
app.use(cors({
    origin:'http://localhost:8000',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
}))
app.use(experss.json());
app.use('/api/ai', router);
const PORT =`http://localhost:3000`
app.listen(3000, () => {
    console.log(`Server is running on port ${PORT}`);
});