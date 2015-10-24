youtube.factory('youtubeApi', ['$http', function($http){

	var playlistIds = [];

	// our youtube data api key
	var api_key = 'AIzaSyAvMwtVcyRbuOZkESCDckpfjITfS7LCjnA';
	// channel to use for searches
	var search_channel = "UCsT0YIqwnpJCM-mx7-gSA4Q";

	// playlists repository
	var playlists = {};
	// videos repository
	var videos = {};
	// public videos
	var tedxWilmingtonVideos = [];

	// the last term or phrase searched for
	var lastSearchTerm = "";
	// the results of the last search
	var lastSearch = [];

	/**
	 *	YoutubeVideo constructor
	 *	@param {Integer}	id 		the videos's unique id
	 *	@param {Object}		[info] 	video metadata as returned from youtube data api
	 */
	function YoutubeVideo(id, info) {
		this.id = id;
		this.embedUrl = "https://www.youtube.com/embed/" + id;

		if(typeof info !== "undefined") {
			this.title = info.title;
			this.description = info.description;
			this.publishedAt = info.publishedAt;
			this.thumbnails = info.thumbnails;
		}
	}

	/**
	 * 	Import the metadata in info into this video
	 *	@param {Object}	info 	Info describing this video as returned from youtube data api
	 * 	@return {YoutubeVideo}	Returns this YoutubeVideo
	 */
	YoutubeVideo.prototype.importInfo = function(info) {
		this.title = info.title;
		this.description = info.description;
		this.publishedAt = info.publishedAt;
		this.thumbnails = info.thumbnails;

		return this;
	};

	/**
	 *	YoutubePlaylist constructor
	 *	@param {integer}	id 		the playlist's unique id
	 *	@param {Object}		[info] 	playlist metadata returned from youtube data api
	 */
	function YoutubePlaylist(id, info) {
		this.id = id;
		this.hasItems = false;
		this.items = [];

		if(! typeof info !== "undefined") {
			this.title = info.title;
			this.description = info.description;
			this.publishedAt = info.publishedAt;
			this.thumbnails = info.thumbnails;
		}
	}

	/**
	 *	Import information returned from Youtube's data api describing this
	 *	playlist.
	 *	@param {Object}		info 	playlist metadata returned from youtube data api
	 *	@return {YoutubePlaylist}	returns this
	 */
	YoutubePlaylist.prototype.importInfo = function(info) {
		this.title = info.title;
		this.description = info.description;
		this.publishedAt = info.publishedAt;
		this.thumbnails = info.thumbnails;

		return this;
	};

	/**
	 *	Import videos in this playlist as returned from Youtube's data api
	 *	playlist
	 *	@param {Object}				response 	playlist videos metadata returned from youtube data api
	 *	@return {YoutubePlaylist}				returns this
	 */
	YoutubePlaylist.prototype.importVideos = function(response) {
		var filtered = response.items.filter(function(x) {
			return true; //return x.resourceId.kind === "youtube#video";
		});

		for(var index in response.items) {
			var item = response.items[index];
			var id = item.snippet.resourceId.videoId;

			if(!videos[id]) {
				videos[id] = new YoutubeVideo(id, item.snippet);
				tedxWilmingtonVideos.push(videos[id]);
			}
			else {
				videos[id].importInfo(item.snippet);
			}

			this.items.push(videos[id]);
		}
		this.hasItems = true;

		return this;
	};

	/**
	 *	Ajax wrapper function.  Sends a request to the specified url.
	 *  On response, the response data is passed to the provided callback.
	 *	@param {String}		url 		Endpoint (with query params) to send a GET request
	 *	@param {Function} 	callback	Callback function to pass the response data to
	 */
	function ajaxWrapper(url, callback) {
		$http({
		  method: 'GET',
		  url: url
		}).then(
			// unwrap the response before calling the callback function
			function(response) { callback(response.data); }
		);
	}

	/**
	 *	Format an url to request videos for the provided playlist
	 *  @param {YoutubePlaylist} playlist 	The playlist to request videos for
	 */
	function requestPlaylistVideosUrl(playlist) {
		return "https://www.googleapis.com/youtube/v3/playlistItems?key=" + api_key +
			"&playlistId=" + playlist.id +
			"&maxResults=50&part=snippet";
	}

	/**
	 *	Format an url to request metadata for the specified playlists
	 *	@param {YoutubePlaylist[]}	playlists 	array of playlist to request metadata for
	 */
	function requestPlaylistInfoUrl(playlists) {
		return "https://www.googleapis.com/youtube/v3/playlists?key=" + api_key +
			"&id=" + encodeURIComponent(playlists.join(",")) +
			"&part=snippet";
	}

	/**
	 *	Format an url to search the TEDx channel based on the passed search term
	 *	@param {String}		search 	Term to search for
	 */
	function requestSearchUrl(search) {
		return "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50" +
		"&channelId=" + search_channel +
		"&q=" +	encodeURIComponent(search) +
		"&key=" + api_key;
	}

	/**
	 *	Request the current TEDx Wilmington youtube playlists from the server
	 *  On successful response, save the playlists and subsequently request
	 *  the corresponding metadata/videos for each playlist.
	 */
	function requestPlaylistIds() {
		$http({
		  method: 'GET',
		  url: "lib/zipYoutube/data/youtube_playlists.json"
		}).then(
			// store the playlists and request the metadata/videos for them
			function(response) {
				playlistIds = response.data;
		    	requestPlaylistMetadataAjax(playlistIds);
			}
		);
	}

	/**
	 * Request a list of videos in the passed playlist
	 *	@param {YoutubePlaylist} playlist 	The playlist to request the videos for
	 */
	function requestVideosAjax(playlist) {
		var url = requestPlaylistVideosUrl(playlist);
		//var callback = playlist.importVideos.bind(playlist);
		var callback = function(response) {
			playlist.importVideos(response);	
		}
		
		ajaxWrapper(url, callback);
	}

	/**
	 *	Request playlist metadata for all playlists via ajax
	 *  @param {Array[String]}	playlists	The playlist id(s) to request metadata for
	 */
	function requestPlaylistMetadataAjax(playlists) {
		var url = requestPlaylistInfoUrl(playlists);
		var callback = importPlaylistMetadata;
		ajaxWrapper(url, callback);
	}

	/**
	 *	Request ajax search data
	 *  @param {String}		The terms(s) to search for
	 */
	function requestSearchAjax(search) {
		// empty the previous array (this needs to be done before the array is returned)
		lastSearch = [];
		var url = requestSearchUrl(search);
		var callback = importSearchResults;
		ajaxWrapper(url, callback);
	}

	/**
	 *	Import playlist data returned from youtube's data api
	 *  @param {Object}		response	json data as returned from youtube's data api
	 */
	function importPlaylistMetadata(response) {
		for(var index in response.items) {
			var item = response.items[index];
			if(!playlists[item.id]) {
				playlists[item.id] = new YoutubePlaylist(item.id, item.snippet);
			}
			else {
				playlists[item.id].importInfo(item.snippet);
			}
			requestVideosAjax(playlists[item.id]);
		}
	}

	/**
	 *	Import the results from a search 
	 */
	function importSearchResults(response) {
		var results = {};

		response.items.forEach(function(i) {
			var id = i.id.videoId;

			if(typeof videos[id] === "undefined") {
				videos[id] = new YoutubeVideo(id, i.snippet);
				results[id] = videos[id];
			}
			else {
				videos[id].importInfo(i.snippet);
				results[id] = videos[id];
			}
		});

		Array.prototype.push.apply(lastSearch, mapToArray(results));
	}

	/**
	 *	Map the to array
	 * 	@param 	{Object}	obj 	An object to map to an array
	 *	@return {Array}				The resulting array
	 */
	function mapToArray(obj) {
		return Object.keys(obj)
			.filter(function(x) {
				return obj.hasOwnProperty(x);
			})
			.map(function(x) {
			return obj[x];
		});
	}

	/**
	 *	Get an array of all known TEDx Wilmington Videos
	 * 	@return [YoutubeVideo]	Array of videos
	 */
	function getVideos() {
		return tedxWilmingtonVideos;
	}

	/**
	 * Get an array of all known playlists
	 * 	@return [YoutubePlaylist]	Array of playlists
	 */
	function getPlaylists() {
		return mapToArray(playlists);
	}

	/**
	 *	Get the last term/phrase used in the last search
	 *	@return {String}	The term/phrase used in the last search
	 */
	function getLastSearchTerm() {
		return lastSearchTerm;
	}

	/**
	 *	Get the array containing the results of the last search
	 *	@return {Array[YoutubeVideo]}	the array of results from the last search
	 */
	function getLastSearch() {
		return lastSearch;
	}

	// initialize the default playlists
	requestPlaylistIds();

    return {
    	search: requestSearchAjax,
    	getLastSearch: getLastSearch,
    	getLastSearchTerm: getLastSearchTerm,
    	getPlaylists: getPlaylists,
    	getVideos: getVideos
    };
}]);