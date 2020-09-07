# Edusoft

**Edusoft** can help you get information from Edusoft website easily.

    const { EduSoft } = require('edusoft');
    const edu = new EduSoft('<ID>', '<password>');

## Installation

    npm install edusoft

## Features

 - Get listing of scores
 - Get Edusoft news
 - Get tuition
 - Get test schedule
 - Get schedule

## API
### List of scores

    let scores = await edu.getTranscript({2019, 1});
### News

    let news = await edu.getNews();
### Tuition

    let tuition = await edu.getTuition();
### Test schedule

    let testSchedule = await edu.getTestSchedule();
### Schedule

    let schedule = await edu.getSchedule();