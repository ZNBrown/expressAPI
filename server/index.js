const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening from port ${port}`);
});