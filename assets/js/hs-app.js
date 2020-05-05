function initSearch(cfg) {
	return {
		query: '',
		loading: true,
		results: null,
		search: function() {
			if (!this.query) {
				return;
			}

			this.loading = true;

			var queries = {
				requests: [
					{ indexName: cfg.index, facets: [ 'genre' ], params: `query=${encodeURIComponent(this.query)}` }
				]
			};

			const host = `https://${cfg.app_id}-dsn.algolia.net`;
			const url = `${host}/1/indexes/*/queries`;

			fetch(url, {
				method: 'POST',
				headers: {
					'X-Algolia-Application-Id': cfg.app_id,
					'X-Algolia-API-Key': cfg.api_key
				},
				body: JSON.stringify(queries)
			})
				.then((response) => response.json())
				.then((data) => {
					this.results = null;
					if (data.results) {
						this.results = {
							first: data.results[0]
						};

						var event = new CustomEvent('searchresult', {
							bubbles: true,
							cancelable: true,
							detail: this.results
						});

						document.dispatchEvent(event);
					}

					this.loading = false;
				});
		}
	};
}

function debounce(func, wait) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			func.apply(context, args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
