#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const cmd = minimist(process.argv.slice(2));
var help = cmd.h || false;
var latitude = cmd.n || -cmd.s || 35.875;
var longitude = cmd.e || -cmd.w || -79;
var timezone = cmd.z || moment.tz.guess();
var day = (cmd.d !== undefined) ? cmd.d : 1;
var json = cmd.j || false;

var URL = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone;
const response = await fetch(URL);
const data = await response.json();

function show_help(){
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE");
    console.log("    -h            Show this help message and exit.");
    console.log("    -n, -s        Latitude: N positive; S negative.");
    console.log("    -e, -w        Longitude: E positive; W negative.");
    console.log("    -z            Time zone: uses tz.guess() from moment-timezone by default.");
    console.log("    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.");
    console.log("    -j            Echo pretty JSON from open-meteo API and exit.");
    process.exit();
}

function show_json(){
    console.log(data);
    process.exit();
}

function get_weather(){
    var raining = data.daily.precipitation_hours;
    var date = get_date();
    if (raining[day] > 0){
        console.log("You might need your galoshes " + date);
    } else {
        console.log("You will not need your galoshes " + date);
    }
    process.exit();
}

function get_date(){
    if (day == 0){
        return "today.";
    } else if (day == 1){
        return "tomorrow.";
    } else {
        return "in " + day + " days.";
    }
}

if (help){
    show_help();
} else if (json){
    show_json();
} else {
    get_weather();
}