var request = require('request');

//request.get('https://dl.dropboxusercontent.com/u/17526827/coursera/hw-4-sample.txt', function (error, response, body) {
request.get('http://spark-public.s3.amazonaws.com/algo1/programming_prob/SCC.txt', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var body = body;
        var points = body.split('\n');

        for (var i = 0; i < points.length; i++ ){
            points[i] = points[i].split(' ');
            points[i].splice(-1);
            for(var j = 0; j < points[i].length; j++){
                points[i][j] = parseInt(points[i][j]);
            }
        }

        function bfs(node, localGraph, visitedNodes){
            var vertex,
                visitedNodes = visitedNodes || {};

            if (!visitedNodes[node]) {
                visitedNodes[node] = true;
            }

            for(var i = 0; i < localGraph.length; i ++){

                if (localGraph[i][0] === node){

                    var row = localGraph[i].slice();

                    if (!visitedNodes[row[1]]) {
                        setTimeout( function() { // http://stackoverflow.com/questions/20936486/node-js-maximum-call-stack-size-exceeded
                            bfs(row[1], localGraph, visitedNodes);
                        }, 0 );
                    }

                }
            }

            finishingTimes[node - 1] = counter++;
        }


        function flip (graph){
            var g = graph.map(function(arr) {
                var tmp = arr[0];
                arr[0] = arr[1];
                arr[1] = tmp;
                return arr.slice();
            });
            return g;
        }

        var pointsFlipped = flip(points),
            visitedNodesGlobal = {},
            finishingTimes = [],
            counter = 1;

        for(var j = pointsFlipped.length -1; j >= 0; j--) {
            if( !visitedNodesGlobal[pointsFlipped[j][0]] ) {
                bfs(pointsFlipped[j][0], pointsFlipped, visitedNodesGlobal);
            }
        }


        var newPoints = points.slice();

        for(var p = 0; p < newPoints.length; p++) {
            for (var m = 0 ; m < newPoints[p].length; m++) {
                var newIndex = newPoints[p][m];
                newPoints[p][m] = finishingTimes[newIndex -1];
            }
        }
        newPoints = flip(newPoints);

        var flippedPointsVisited = {},
            scc = {};

        var largest = 0;
        for (var e = 0; e < pointsFlipped.length; e++) {
            if (pointsFlipped[e][0] > largest) {
                largest = pointsFlipped[e][0];
            }
        }

        var marker = 0;

        var lengthArr = [];

        for(var k = largest; k >= 0; k--) {

            for(var r = 0; r < newPoints.length; r++) {

                var newPointsFirstIndex = newPoints[r][0];

                if (newPointsFirstIndex === k) { 
                    if( !flippedPointsVisited[newPoints[r][0]] ) {
                        bfs(newPointsFirstIndex, newPoints, flippedPointsVisited);

                        var objKeysLen = Object.keys(flippedPointsVisited).length;
                        lengthArr.push(objKeysLen - marker);
                        marker = objKeysLen;
                    }
                }
            }
        }

        lengthArr.sort(function(a, b){
            return b - a;
        })

        console.log(lengthArr);
    }
});