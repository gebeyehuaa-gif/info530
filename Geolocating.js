const API_KEY = 'AIzaSyCUrXltBNrIPML-9uX-OeHpo6ZPVHs8Zf4';
const benchmarkSelect = document.getElementById('benchmark');
const addressForm = document.getElementById('address-form');
const message = document.getElementById('message');
const result = document.getElementById('result');
const mapContainer = document.getElementById('map-container');

function loadBenchmarks() {
	fetch('https://geocoding.geo.census.gov/geocoder/benchmarks?format=json')
		.then(response => response.json())
		.then(data => {
			const benchmarks = data.benchmarks || [];
			benchmarkSelect.innerHTML = '';

			if (!benchmarks.length) {
				benchmarkSelect.innerHTML = '<option value="">No benchmarks available</option>';
				return;
			}

			benchmarks.forEach(benchmark => {
				const option = document.createElement('option');
				option.value = benchmark.benchmarkName;
				option.textContent = benchmark.benchmarkDescription || benchmark.benchmarkName;
				benchmarkSelect.appendChild(option);
			});

			const defaultBenchmark = benchmarks.find(item => item.isDefault);
			if (defaultBenchmark) {
				benchmarkSelect.value = defaultBenchmark.benchmarkName;
			}
		})
		.catch(() => {
			benchmarkSelect.innerHTML = '<option value="">Unable to load benchmarks</option>';
			message.textContent = 'Could not load benchmark list from the Census API.';
		});
}

addressForm.addEventListener('submit', async function (event) {
	event.preventDefault();

	const address = document.getElementById('address').value.trim();
	const benchmark = benchmarkSelect.value;

	if (!address || address.includes('\n') || address.includes('\r')) {
		message.textContent = 'Please enter a complete one-line address.';
		result.innerHTML = '';
		mapContainer.innerHTML = '';
		return;
	}

	if (!benchmark) {
		message.textContent = 'Please select a benchmark.';
		return;
	}

	message.textContent = 'Searching...';
	result.innerHTML = '';
	mapContainer.innerHTML = '';

	try {
		const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=${encodeURIComponent(benchmark)}&format=json&address=${encodeURIComponent(address)}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		const match = data.result?.addressMatches?.[0];

		if (!match) {
			message.textContent = 'No matching address was found.';
			return;
		}

		const lat = match.coordinates.y;
		const lon = match.coordinates.x;

		message.textContent = 'Address matched successfully.';
		result.innerHTML = `
			<strong>Matched Address:</strong> ${match.matchedAddress}<br>
			<strong>Latitude:</strong> ${lat}<br>
			<strong>Longitude:</strong> ${lon}
		`;

		const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(match.matchedAddress)}&center=${lat},${lon}&zoom=16`;

		mapContainer.innerHTML = `
			<iframe
				width="600"
				height="400"
				style="border:0; width:100%; max-width:600px; margin-top:1rem;"
				loading="lazy"
				allowfullscreen
				referrerpolicy="strict-origin-when-cross-origin"
				src="${mapUrl}">
			</iframe>
		`;
	} catch (error) {
		console.error('Geocoding error:', error);
		message.textContent = 'There was an error while geocoding the address. Please try again.';
		result.innerHTML = '';
		mapContainer.innerHTML = '';
	}
});

loadBenchmarks();
