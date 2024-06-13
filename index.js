const express = require('express')
const app = express()
const PORT = 8000
const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis-11574.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 11574,
    password: 'YaFfD6zQjEGlXlqkxsQOwsvWQPc6drbu'
});

app.get('/', async (req, res) => {
    try {
        const cachedData = await redis.get("users");
        if (cachedData) {
            const users = JSON.parse(cachedData);
            return res.status(200).json(users);
        } else {
            const result = await fetch("https://jsonplaceholder.typicode.com/posts");
            const data = await result.json();
            await redis.set("users", JSON.stringify(data));
            return res.status(200).json(data);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

app.get('/:id',async (req,res)=>{
    const id = req.params.id;
    try {
        const cachedData = await redis.get(`user:${id}`);
        if (cachedData) {
            const users = JSON.parse(cachedData);
            return res.status(200).json(users);
        } else {
            const result = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
            const data = await result.json();
            await redis.set(`user:${id}`, JSON.stringify(data));
            return res.status(200).json(data);
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
})