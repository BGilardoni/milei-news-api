const port  = process.env.port || 4000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
    {
        name: 'elcronista',
        address: 'https://www.cronista.com/',
        base: 'https://www.cronista.com'
    },
    {
        name: 'clarin',
        address: 'https://www.clarin.com/economia/',
        base: ''
    },
    {
        name: 'lanacion',
        address: 'https://www.lanacion.com.ar/economia/',
        base: 'https://www.lanacion.com.ar'
    },
    {
        name: 'infobae',
        address: 'https://www.infobae.com/economia/',
        base: 'https://www.infobae.com'
    },
    {
        name: 'pagina12',
        address: 'https://www.pagina12.com.ar/',
        base:''
    },
    {
        name: 'noticiasargentinas',
        address: 'https://noticiasargentinas.com/',
        base:'https://noticiasargentinas.com'
    },
    {
        name: 'elpais',
        address: 'https://elpais.com/noticias/argentina/',
        base:''
    },
    {
        name: 'perfil',
        address: 'https://www.perfil.com/',
        base:''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response)=>{
            const html = response.data; 
            const $ = cheerio.load(html);

            $('a:contains("Milei")', html).each(function (){
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url : newspaper.base + url,
                    source: newspaper.name
                });
            });
        })
});

app.get('/', (req, res) => {
    res.json('Welcome to my test API')
});

app.get('/noticias', (req, res) => {
    res.json(articles);
});

app.get('/noticias/:newspaperID', (req,res) =>{
    const newspaperID = req.params.newspaperID;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base;

    axios.get(newspaperAddress)
        .then(response =>{
            const html = response.data;
            $ = cheerio.load(html);
            const specificArticles = [];

            $('a:contains("Milei")', html).each(function (){
                const title = $(this).text();
                const url = $(this).attr('href');
                specificArticles.push({
                    title,
                    url : newspaperBase + url,
                    source: newspaperID
                });
            })
            res.json(specificArticles);
        }).catch(err => console.log(err)); 
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
