import Alpine from 'jslibs/alpinejs/v3/alpinejs/dist/module.esm.js';
import * as params from '@params';

// Set up and start Alpine.
(function() {
	const searchConfig = params.search_config;

	// Register AlpineJS data controllers.
	Alpine.data('searchController', () => newSearchController(searchConfig));

	// Start Alpine.
	Alpine.start();
})();

function newSearchController(cfg) {
	return {
		query: '',
		result: { hits: [] },
		init: function() {
			return this.$nextTick(() => {
				this.$watch('query', () => {
					this.search();
				});
			});
		},
		search: function() {
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
					if (data.results) {
						this.result = data.results[0];
						let genre = this.result.facets.genre;
						this.result.genre = genre
							? Object.keys(genre).map((key) => {
									return { k: key, v: genre[key] };
								})
							: [];
					}
				});
		}
	};
}
