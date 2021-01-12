# EduSoft

**EduSoft Package** can help you get information from EduSoft website easily.

    const { initEduSoft } = require('edusoft');
    const edu = initEduSoft('<Student ID>', '<Password>');

## Installation

    npm install edusoft

## Features

 - Get listing of scores
 - Get news
 - Get tuition
 - Get test schedule
 - Get schedule
 - Register subject

## API
### List of scores

    let scores = await edu.getTranscript(2019, 1);

### News

    let news = await edu.getNews();

### Tuition

    let tuition = await edu.getTuition();

### Test schedule

    let testSchedule = await edu.getTestSchedule();

### Schedule

    let schedule = await edu.getSchedule();

### Register subject

    edu.register('<Subject ID>');
