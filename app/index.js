'use strict';

// Style 
import './index.scss';

import usmapfile from "./data/us-10m.v1.json";
import unemploymentfile from "./data/unemployment.tsv";

console.log(usmapfile);

console.log('Boilerplate is working!');


import $ from 'jquery';
import * as d3 from 'd3';
import * as topojson from 'topojson';
// import d3SelectMulti from 'd3-selection-multi';





$(() => {

    var svg = d3.select('#d3-root'),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var unemployment = d3.map();

    var path = d3.geoPath();

    function delayedHello(name, delay, callback) {
        setTimeout(function () {
            console.log("Hello, " + name + "!");
            callback(null);
        }, delay);
    }

    var x = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

var color = d3.scaleThreshold()
    .domain(d3.range(2, 10))
    .range(d3.schemeGreens[9]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Unemployment rate");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x + "%"; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();




    var promises = [];


    // promises.push(d3.json("data/us-10m.v1.json"));
    // promises.push(d3.tsv("data/unemployment.tsv"));


    promises.push(d3.json(usmapfile));
    promises.push(d3.tsv(unemploymentfile));

    Promise.all(promises).then(function (values) {
        let us = values[0];
        values[1].forEach(element => {
            unemployment.set(element.id, +element.rate);
        });;

        svg.append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
            .enter().append("path")
            .attr("fill", function (d) {
                return color(d.rate = unemployment.get(d.id));
            })
            .attr("d", path)
            .append("title")
            .text(function (d) {
                return d.rate + "%";
            });

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                return a !== b;
            }))
            .attr("class", "states")
            .attr("d", path);

        console.log(values);
    });

});