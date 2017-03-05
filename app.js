var spotifyBaseURL = "https://api.spotify.com/v1/search";
var spotifyURL = "https://api.spotify.com/v1/artists/{id}/top-tracks";
var spotifyArtists = "https://api.spotify.com/v1/artists/";
var spotifyTopTracks = "/top-tracks?country=US";


$(document).ready(function() {

// get data from api

	$('.search-box').submit(function(event) {
		event.preventDefault();
		$('ul').empty();
		var artistName = $('.search-text').val();
		var params = {
			type: 'artist',
			q: artistName,
			key: '344c535a8dd24b82a640784c365cc416'
		}
	});
	var dataFromApi = $.getJSON(spotifyBaseURL, params);
	console.log(dataFromApi);

	var getTopTracks = dataFromApi.then(function(data) {
		var artistId = data.artists.items[0].id;
// get artist

		if (data.artists.items.length === 0) {
			$('.results-header').text('No artists found. Please enter a valid artist.');
		}
		else {
			console.log(data.artists.items[0].id);
			$('.results-header').html(data.artists.items[0].name +
			 "'s Top 5 Tracks");
// get top tracks

			return $.getJSON(spotifyArtists + artistId + spotifyTopTracks);
		}
	});


// append tracks

	var trackList = [];
	getTopTracks.then(function(data) {
		console.log(data.tracks[0].artists[0].name);
		var artist = data.tracks[0].artists[0].name;

		for (var i = 0; i < 5; i++) {
			trackList.push(data.tracks[i].name);
			$('ul').append('<li class="trackItem" style="display: none;" id=' + 
				data.tracks[i].id + '>' + data.tracks[i].name + '</li>');
		}
		console.log(trackList);
	});
	$('.search-text').val("");


// preview tracks

	var audioList = [];

	var getAudio = function () {
		var trackId = $(this).attr("id");
	    var track = $.getJSON('https://api.spotify.com/v1/tracks/' + trackId);
	    var playTrack = track.then(function(playTrack) {
	    	var playAudio = new Audio(playTrack.preview_url);
	    	console.log(playTrack.preview_url);

	    	audioList = [];
	        audioList.push(playAudio);
	        playAudio.play();
	    });
	};

// checks if anything in array, if there is, pause and clear it to play next song

	$('ul').on('click touchstart', '.trackItem', function() {
	    if (audioList.length === 1) {
	    	audioList[0].pause(); 

	    	var trackId = $(this).attr("id");
	      	var track = $.getJSON('https://api.spotify.com/v1/tracks/' + trackId);
	      	var playTrack = track.then(function(playTrack) {
	        	var playAudio = new Audio(playTrack.preview_url);
	        	console.log(playTrack.preview_url);

	        	audioList = [];
	        	audioList.push(playAudio);
	        	playAudio.play();
	      	});
	  	}
// if nothing is in the array play normally
	 
	    else {
	      	var trackId = $(this).attr("id");
	      	var track = $.getJSON('https://api.spotify.com/v1/tracks/' + trackId);
	      	var playTrack = track.then(function(playTrack) {
	        	var playAudio = new Audio(playTrack.preview_url);
	        	console.log(playTrack.preview_url);
// adds current song into the audiolist to check if something is in array later.

	        	audioList = [];
	        	audioList.push(playAudio);
	        	playAudio.play();
	      	});
	    } 
  	});


});
